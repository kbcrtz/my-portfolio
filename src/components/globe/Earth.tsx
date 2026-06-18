import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { GLOBE_RADIUS } from "./latLngToPosition";

type EarthProps = {
  isDark: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
};

const Earth = ({ isDark, isMobile, reducedMotion }: EarthProps) => {
  // Specular map doubles as a land/ocean mask: ocean is bright, land is dark.
  const mask = useTexture("/images/earth-spec-2k.jpg");
  const gl = useThree((state) => state.gl);

  // Light grey glow on the dark site theme; darker slate so it still reads on
  // the light theme's near-white page background (the container is transparent).
  const hologramColor = isDark ? "#e3e9f2" : "#3d4655";

  const material = useMemo(() => {
    mask.colorSpace = THREE.NoColorSpace;
    mask.anisotropy = gl.capabilities.getMaxAnisotropy();
    mask.needsUpdate = true;

    return new THREE.ShaderMaterial({
      uniforms: {
        uMask: { value: mask },
        uColor: { value: new THREE.Color(hologramColor) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMask;
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vView;

        // Distance-to-nearest-line grid, returns ~1 on the line.
        float gridLine(float coord, float count, float width) {
          float f = fract(coord * count);
          float d = min(f, 1.0 - f);
          return 1.0 - smoothstep(0.0, width, d);
        }

        void main() {
          float ocean = texture2D(uMask, vUv).r;
          float land = smoothstep(0.45, 0.6, 1.0 - ocean);

          // Holographic lat/long mesh — the defining feature.
          float grid = max(
            gridLine(vUv.x, 24.0, 0.006),
            gridLine(vUv.y, 12.0, 0.008)
          );

          float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.6);

          // Scanlines drifting up the globe.
          float scan = 0.5 + 0.5 * sin(vUv.y * 190.0 - uTime * 2.2);
          float scanMix = mix(0.7, 1.0, scan);

          float landGlow = land * 0.9 * scanMix;
          float intensity = landGlow + grid * 0.7 + fresnel * 0.18;
          float alpha = clamp(0.04 + land * 0.4 + grid * 0.5 + fresnel * 0.12, 0.0, 1.0);

          gl_FragColor = vec4(uColor * intensity, alpha);
        }
      `,
      transparent: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });
    // The hologram tint (uColor) is updated per-render below so theme changes
    // don't rebuild the whole material.
  }, [mask, gl]);

  useFrame((state) => {
    if (reducedMotion) return;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  // Keep the hologram tint in sync with the active theme.
  material.uniforms.uColor.value.set(hologramColor);

  const segments = isMobile ? 64 : 96;

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, segments, segments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export default Earth;
