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

const LocationMarker = ({
  location,
  position,
  isActive,
  reducedMotion,
  onSelect,
}: LocationMarkerProps) => {
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

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
    const dot = dotRef.current;
    if (dot) {
      const distance = state.camera.position.distanceTo(position);
      dot.scale.setScalar(dotScale * (distance / BASE_DISTANCE));
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

  const handleOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(location.id);
  };

  return (
    <group position={position} quaternion={orientation}>
      {/* Invisible hit target — kept larger than the dot so the tiny pinpoint
          stays tappable. */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
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
