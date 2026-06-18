import { Billboard } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { memo, useRef, useState } from "react";
import * as THREE from "three";
import type { GlobeLocation } from "../../types/portfolio";

type LocationMarkerProps = {
  location: GlobeLocation;
  position: THREE.Vector3;
  isActive: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
};

const LocationMarker = ({
  location,
  position,
  isActive,
  reducedMotion,
  onSelect,
}: LocationMarkerProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const ring = ringRef.current;
    if (!ring || reducedMotion) return;
    const pulse = (Math.sin(state.clock.elapsedTime * 2.4) + 1) / 2;
    ring.scale.setScalar(1 + pulse * (isActive ? 1.6 : 0.9));
    (ring.material as THREE.MeshBasicMaterial).opacity =
      (1 - pulse) * (isActive ? 0.85 : 0.4);
  });

  const dotScale = (isActive ? 1.5 : 1) * (hovered ? 1.25 : 1);

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
    <group position={position}>
      {/* Invisible hit target — kept larger than the dot so the tiny pinpoint
          stays tappable. */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[0.014, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Visible marker dot. */}
      <mesh scale={dotScale}>
        <sphereGeometry args={[0.006, 16, 16]} />
        <meshBasicMaterial color={location.accentColor} toneMapped={false} />
      </mesh>

      {/* Pulsing / static beacon ring, always facing the camera. */}
      <Billboard>
        <mesh ref={ringRef} scale={isActive ? 1.6 : 1}>
          <ringGeometry args={[0.0085, 0.013, 32]} />
          <meshBasicMaterial
            color={location.accentColor}
            transparent
            opacity={reducedMotion ? 0.55 : 0.4}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
};

export default memo(LocationMarker);
