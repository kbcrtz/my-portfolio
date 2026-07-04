import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { StackItem } from "../../types/portfolio";

// Resolution the logo SVG is rasterized at before sampling. Higher = finer
// detail available to the sampler; 200px resolves every icon in the stack.
const RASTER_SIZE = 200;
// Pixels with alpha above this count as part of the logo shape.
const ALPHA_THRESHOLD = 64;

const cache = new Map<string, Promise<Float32Array>>();

/**
 * Rasterizes a react-icons logo offscreen and samples `count` random points
 * from its filled pixels. Points come back as [x0, y0, x1, y1, ...] centered
 * on the glyph's bounding box, with the larger dimension normalized to
 * [-0.5, 0.5] and +y up — ready to scale into world units.
 */
export const getLogoStarPoints = (
  name: string,
  icon: StackItem["icon"],
  count: number,
): Promise<Float32Array> => {
  const key = `${name}:${count}`;
  let points = cache.get(key);
  if (!points) {
    points = sampleIcon(icon, count);
    cache.set(key, points);
  }
  return points;
};

const sampleIcon = async (
  icon: StackItem["icon"],
  count: number,
): Promise<Float32Array> => {
  // Serialized outside the DOM there is no CSS context, so the icon's
  // fill/stroke of currentColor must be pinned to an opaque color.
  const markup = renderToStaticMarkup(
    createElement(icon, { size: RASTER_SIZE }),
  ).replace(/currentColor/g, "#ffffff");

  const blob = new Blob([markup], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const canvas = document.createElement("canvas");
    canvas.width = RASTER_SIZE;
    canvas.height = RASTER_SIZE;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas 2D context unavailable");
    context.drawImage(image, 0, 0, RASTER_SIZE, RASTER_SIZE);

    const { data } = context.getImageData(0, 0, RASTER_SIZE, RASTER_SIZE);
    const filled: number[] = [];
    let minX = RASTER_SIZE;
    let minY = RASTER_SIZE;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < RASTER_SIZE; y += 1) {
      for (let x = 0; x < RASTER_SIZE; x += 1) {
        const alpha = data[(y * RASTER_SIZE + x) * 4 + 3];
        if (alpha > ALPHA_THRESHOLD) {
          filled.push(x, y);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const pixelCount = filled.length / 2;
    if (pixelCount === 0) throw new Error("Logo rasterized to empty bitmap");

    // Normalize by the glyph's own bounding box so every logo forms at the
    // same visual size regardless of how much padding its viewBox carries.
    const span = Math.max(maxX - minX + 1, maxY - minY + 1);
    const centerX = (minX + maxX + 1) / 2;
    const centerY = (minY + maxY + 1) / 2;

    const points = new Float32Array(count * 2);
    for (let i = 0; i < count; i += 1) {
      const pick = Math.floor(Math.random() * pixelCount) * 2;
      const px = filled[pick] + Math.random();
      const py = filled[pick + 1] + Math.random();
      points[i * 2] = (px - centerX) / span;
      points[i * 2 + 1] = (centerY - py) / span;
    }
    return points;
  } finally {
    URL.revokeObjectURL(url);
  }
};
