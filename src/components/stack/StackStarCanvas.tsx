import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { StackItem } from "../../types/portfolio";
import { getLogoStarPoints } from "./logoStarPoints";

const STAR_COUNT = 1500;
// World-unit size of a formed logo's larger dimension. Camera sits at z=6
// with fov 42, so the visible plane at z=0 is ~4.6 world units tall.
const LOGO_SIZE = 2.7;
// Depth jitter across a formed logo — gives the "flat" logo real parallax.
const LOGO_DEPTH = 0.55;
// Every Nth star stays scattered behind the logo so space still feels starry.
const AMBIENT_EVERY = 8;
// Idle scatter volume.
const FIELD_X = 3.7;
const FIELD_Y = 2.3;
const FIELD_Z_NEAR = 1.3;
const FIELD_Z_FAR = -4.2;

const WHITE = new THREE.Color("#ffffff");

type StarStore = {
  positions: Float32Array;
  displayColors: Float32Array;
  colorState: Float32Array;
  targets: Float32Array;
  targetColors: Float32Array;
  home: Float32Array;
  seeds: Float32Array;
  speeds: Float32Array;
  eases: Float32Array;
  logoDepth: Float32Array;
};

const randomHome = (index: number, out: Float32Array) => {
  out[index * 3] = (Math.random() * 2 - 1) * FIELD_X;
  out[index * 3 + 1] = (Math.random() * 2 - 1) * FIELD_Y;
  out[index * 3 + 2] =
    FIELD_Z_FAR + Math.random() * (FIELD_Z_NEAR - FIELD_Z_FAR);
};

const createStore = (): StarStore => {
  const positions = new Float32Array(STAR_COUNT * 3);
  const displayColors = new Float32Array(STAR_COUNT * 3);
  const colorState = new Float32Array(STAR_COUNT * 3);
  const targets = new Float32Array(STAR_COUNT * 3);
  const targetColors = new Float32Array(STAR_COUNT * 3);
  const home = new Float32Array(STAR_COUNT * 3);
  const seeds = new Float32Array(STAR_COUNT);
  const speeds = new Float32Array(STAR_COUNT);
  const eases = new Float32Array(STAR_COUNT);
  const logoDepth = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i += 1) {
    randomHome(i, home);
    targets.set(home.subarray(i * 3, i * 3 + 3), i * 3);
    // Start pushed further out than home so mounting condenses the field in.
    positions[i * 3] = home[i * 3] * 1.7;
    positions[i * 3 + 1] = home[i * 3 + 1] * 1.7;
    positions[i * 3 + 2] = home[i * 3 + 2] - 1.5;

    seeds[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.5 + Math.random() * 1.2;
    eases[i] = 0.55 + Math.random() * 0.9;
    logoDepth[i] = (Math.random() - 0.5) * LOGO_DEPTH;

    const brightness = 0.3 + Math.random() * 0.7;
    for (let channel = 0; channel < 3; channel += 1) {
      colorState[i * 3 + channel] = brightness;
      displayColors[i * 3 + channel] = brightness;
      targetColors[i * 3 + channel] = brightness;
    }
  }

  return {
    positions,
    displayColors,
    colorState,
    targets,
    targetColors,
    home,
    seeds,
    speeds,
    eases,
    logoDepth,
  };
};

const createStarTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.28, "rgba(255,255,255,0.85)");
    gradient.addColorStop(0.62, "rgba(255,255,255,0.18)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

type StarFieldProps = {
  items: StackItem[];
  activeIndex: number;
  reducedMotion: boolean;
  isMobile: boolean;
};

const StarField = ({
  items,
  activeIndex,
  reducedMotion,
  isMobile,
}: StarFieldProps) => {
  const store = useMemo(createStore, []);
  const starTexture = useMemo(createStarTexture, []);
  const groupRef = useRef<THREE.Group>(null);
  const positionAttr = useRef<THREE.BufferAttribute>(null);
  const colorAttr = useRef<THREE.BufferAttribute>(null);
  // 0 = loose idle wobble, 1 = tight formed shimmer; eased in the frame loop.
  const formedTarget = useRef(0);
  const formed = useRef(0);
  // Click-drag rotates the field; it springs back to center on release.
  const drag = useRef({ active: false, x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const invalidate = useThree((state) => state.invalidate);
  const domElement = useThree((state) => state.gl.domElement);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      drag.current = { active: true, x: event.clientX, y: event.clientY };
      domElement.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
      targetRotation.current.y = THREE.MathUtils.clamp(
        targetRotation.current.y + dx * 0.006,
        -0.9,
        0.9,
      );
      targetRotation.current.x = THREE.MathUtils.clamp(
        targetRotation.current.x + dy * 0.004,
        -0.5,
        0.5,
      );
    };
    const onPointerUp = () => {
      drag.current.active = false;
      domElement.style.cursor = "grab";
    };

    domElement.style.cursor = "grab";
    // Horizontal drags rotate; vertical swipes still scroll the page on touch.
    domElement.style.touchAction = "pan-y";
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [domElement]);

  useEffect(() => {
    const attr = positionAttr.current;
    const colors = colorAttr.current;
    if (attr) attr.usage = THREE.DynamicDrawUsage;
    if (colors) colors.usage = THREE.DynamicDrawUsage;
  }, []);

  useEffect(() => () => starTexture.dispose(), [starTexture]);

  // On each selection, retarget every star to a sampled point of that logo
  // (ambient stars keep their scattered home so the sky never fully empties).
  useEffect(() => {
    const item = items[activeIndex];
    const { targets, targetColors, home, logoDepth } = store;

    if (!item) {
      targets.set(home);
      formedTarget.current = 0;
      invalidate();
      return;
    }

    let stale = false;
    getLogoStarPoints(item.name, item.icon, STAR_COUNT).then(
      (points) => {
        if (stale) return;
        const base = new THREE.Color(item.color);
        const tinted = new THREE.Color();

        for (let i = 0; i < STAR_COUNT; i += 1) {
          if (i % AMBIENT_EVERY === 0) {
            targets.set(home.subarray(i * 3, i * 3 + 3), i * 3);
            const dim = 0.16 + Math.random() * 0.24;
            targetColors[i * 3] = dim;
            targetColors[i * 3 + 1] = dim;
            targetColors[i * 3 + 2] = dim;
            continue;
          }
          targets[i * 3] = points[i * 2] * LOGO_SIZE;
          targets[i * 3 + 1] = points[i * 2 + 1] * LOGO_SIZE;
          targets[i * 3 + 2] = logoDepth[i];

          tinted
            .copy(base)
            .lerp(WHITE, Math.random() * 0.3)
            .multiplyScalar(0.85 + Math.random() * 0.55);
          targetColors[i * 3] = tinted.r;
          targetColors[i * 3 + 1] = tinted.g;
          targetColors[i * 3 + 2] = tinted.b;
        }
        formedTarget.current = 1;
        invalidate();
      },
      () => {
        // Sampling failed (should not happen) — fall back to the idle field.
        if (!stale) {
          targets.set(home);
          formedTarget.current = 0;
          invalidate();
        }
      },
    );

    return () => {
      stale = true;
    };
  }, [activeIndex, items, store, invalidate]);

  useFrame((state, delta) => {
    const {
      positions,
      displayColors,
      colorState,
      targets,
      targetColors,
      seeds,
      speeds,
      eases,
    } = store;
    const time = state.clock.elapsedTime;
    const step = Math.min(delta, 0.05);
    // Frame-rate independent easing; reduced motion snaps straight to target.
    const damp = reducedMotion ? 1 : 1 - Math.pow(0.06, step);
    const colorDamp = reducedMotion ? 1 : 1 - Math.pow(0.02, step);

    formed.current += (formedTarget.current - formed.current) * damp;
    const wobbleAmp = reducedMotion
      ? 0
      : 0.055 + (0.012 - 0.055) * formed.current;

    for (let i = 0; i < STAR_COUNT; i += 1) {
      const base = i * 3;
      const seed = seeds[i];
      const speed = speeds[i];
      // Ambient background stars always drift loosely, even when a logo forms.
      const amp =
        i % AMBIENT_EVERY === 0 && !reducedMotion ? 0.055 : wobbleAmp;

      const targetX = targets[base] + Math.sin(time * speed + seed) * amp;
      const targetY =
        targets[base + 1] + Math.cos(time * speed * 0.9 + seed * 1.7) * amp;
      const targetZ =
        targets[base + 2] +
        Math.sin(time * speed * 0.7 + seed * 3.1) * amp * 1.6;

      const ease = Math.min(1, damp * eases[i]);
      positions[base] += (targetX - positions[base]) * ease;
      positions[base + 1] += (targetY - positions[base + 1]) * ease;
      positions[base + 2] += (targetZ - positions[base + 2]) * ease;

      const twinkle = reducedMotion
        ? 1
        : 0.82 + 0.18 * Math.sin(time * (0.8 + speed * 1.6) + seed * 5);
      for (let channel = 0; channel < 3; channel += 1) {
        colorState[base + channel] +=
          (targetColors[base + channel] - colorState[base + channel]) *
          colorDamp;
        displayColors[base + channel] = colorState[base + channel] * twinkle;
      }
    }

    if (positionAttr.current) positionAttr.current.needsUpdate = true;
    if (colorAttr.current) colorAttr.current.needsUpdate = true;

    // Drag rotates the field around the logo; released, it springs back home.
    const group = groupRef.current;
    if (group && !reducedMotion) {
      if (!drag.current.active) {
        // Release: head straight home; the damp below keeps it eased.
        targetRotation.current.x = 0;
        targetRotation.current.y = 0;
      }
      group.rotation.y += (targetRotation.current.y - group.rotation.y) * damp;
      group.rotation.x += (targetRotation.current.x - group.rotation.x) * damp;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            ref={positionAttr}
            attach="attributes-position"
            args={[store.positions, 3]}
          />
          <bufferAttribute
            ref={colorAttr}
            attach="attributes-color"
            args={[store.displayColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={starTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={isMobile ? 0.06 : 0.052}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

type StackStarCanvasProps = StarFieldProps;

const StackStarCanvas = ({
  items,
  activeIndex,
  reducedMotion,
  isMobile,
}: StackStarCanvasProps) => (
  <Canvas
    camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 30 }}
    dpr={[1, isMobile ? 1.5 : 2]}
    frameloop={reducedMotion ? "demand" : "always"}
    gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
  >
    <StarField
      items={items}
      activeIndex={activeIndex}
      reducedMotion={reducedMotion}
      isMobile={isMobile}
    />
  </Canvas>
);

export default StackStarCanvas;
