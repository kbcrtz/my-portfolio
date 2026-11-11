import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { memo, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { GlobeLocation } from "../../types/portfolio";

// Flat geometry (circle/ring) sits in the XY plane with its face pointing +Z.
const FACE_NORMAL = new THREE.Vector3(0, 0, 1);

type LocationMarkerProps = {
  location: GlobeLocation;
  position: THREE.Vector3;
  isActive: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

// Camera-to-dot distance at the zoomed-out overview. The dot is scaled relative
// to this so it keeps a constant on-screen size as the camera zooms in/out.
const BASE_DISTANCE = 1.95;

// Radius of the invisible tap target in CSS pixels, independent of zoom.
// Touch gets ~48px across (above the 44px guideline); mouse can be tighter.
const HIT_RADIUS_TOUCH_PX = 24;
const HIT_RADIUS_MOUSE_PX = 14;

const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

const LocationMarker = ({
  location,
  position,
  isActive,
  reducedMotion,
  onSelect,
}: LocationMarkerProps) => {
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const hitRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hitRadiusPx = useMemo(
    () => (isCoarsePointer() ? HIT_RADIUS_TOUCH_PX : HIT_RADIUS_MOUSE_PX),
    [],
  );

  const dotScale = (isActive ? 1.5 : 1) * (hovered ? 1.25 : 1);

  // Orient the flat dot/ring so their face aligns with the sphere's outward
  // surface normal at this point: flat-on when centered, foreshortening into an
  // ellipse (and edge-on at the limb) as the globe rotates.
  const orientation = useMemo(() => {
    const normal = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(FACE_NORMAL, normal);
  }, [position]);

  useFrame((state) => {
    // Keep the dot a fixed apparent size regardless of zoom: scale it by its
    // distance from the camera (closer → smaller scale → same screen size).
    const distance = state.camera.position.distanceTo(position);
    const dot = dotRef.current;
    if (dot) {
      dot.scale.setScalar(dotScale * (distance / BASE_DISTANCE));
    }

    // Size the unit-radius hit sphere to a fixed pixel radius on screen:
    // world units per pixel at this distance = visible height / viewport height.
    const hit = hitRef.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    if (hit && camera.isPerspectiveCamera && state.size.height > 0) {
      const visibleHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      hit.scale.setScalar((hitRadiusPx * visibleHeight) / state.size.height);
    }

    const ring = ringRef.current;
    if (!ring || reducedMotion) return;
    // The ring only expands outward and fades over the first PING_FRACTION of
    // each cycle; the remainder is an invisible pause so it fully fades out and
    // holds before the next ping — never shrinks back in.
    const PING_FRACTION = 0.7;
    const cycle = (state.clock.elapsedTime * 0.5) % 1;
    const material = ring.material as THREE.MeshBasicMaterial;
    if (cycle >= PING_FRACTION) {
      material.opacity = 0; // faded out, waiting to restart
    } else {
      const t = cycle / PING_FRACTION; // 0→1 across the ping
      ring.scale.setScalar(1 + t * (isActive ? 1.9 : 1.1));
      material.opacity = (1 - t) * (isActive ? 0.85 : 0.4);
    }
  });

  // R3F only raycasts objects with handlers, so the Earth doesn't occlude the
  // hit sphere. Ignore it when the marker is on the far side of the globe.
  const facesCamera = (camera: THREE.Camera) =>
    position.clone().normalize().dot(camera.position.clone().sub(position)) > 0;

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    if (!facesCamera(event.camera)) return;
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!facesCamera(event.camera)) return;
    event.stopPropagation();
    onSelect(location.id);
  };

  return (
    <group position={position} quaternion={orientation}>
      {/* Invisible hit target, much larger than the dot so the tiny pinpoint is
          easy to tap. Unit radius, rescaled per frame (see useFrame) to a fixed
          on-screen pixel size; colorWrite off so it never draws anything. */}
      <mesh
        ref={hitRef}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {/* Visible marker dot — a flat disc lying on the surface. Scaled per-frame
          (see useFrame) to hold a constant on-screen size as the camera zooms. */}
      <mesh ref={dotRef} scale={dotScale}>
        <circleGeometry args={[0.0105, 32]} />
        <meshBasicMaterial
          color={location.accentColor}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pulsing / static beacon ring, lying flat on the surface. */}
      <mesh ref={ringRef} scale={isActive ? 1.6 : 1}>
        <ringGeometry args={[0.017, 0.022, 32]} />
        <meshBasicMaterial
          color={location.accentColor}
          transparent
          opacity={reducedMotion ? 0.55 : 0.4}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default memo(LocationMarker);
