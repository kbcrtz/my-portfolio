import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { GlobeLocation } from "../../types/portfolio";
import Earth from "./Earth";
import LocationMarker from "./LocationMarker";
import { latLngToMarkerPosition, latLngToPosition } from "./latLngToPosition";

// Default (zoomed-out) camera distance for the globe overview. Larger = the
// globe sits smaller in frame so it doesn't touch the container edges.
const OVERVIEW_RADIUS = 2.95;
// Only this location shows a dot on the globe overview.
const GLOBE_MARKER_ID = "seattle";

type GlobeCanvasProps = {
  locations: GlobeLocation[];
  activeId: string;
  selectNonce: number;
  mapOpen: boolean;
  onSelect: (id: string) => void;
  onZoomPhase: () => void;
  reducedMotion: boolean;
  isMobile: boolean;
  isDark: boolean;
};

type GlobeControlsProps = {
  focusLocation?: GlobeLocation;
  selectNonce: number;
  mapOpen: boolean;
  reducedMotion: boolean;
  onZoomPhase: () => void;
};

/**
 * Owns the OrbitControls and drives the camera. The globe idles (slow
 * auto-rotate) until the user selects a location; from then on the spin is
 * disabled and selecting a place lerps the camera to face it. A manual drag
 * cancels any in-flight focus so it never snaps back.
 */
const GlobeControls = ({
  focusLocation,
  selectNonce,
  mapOpen,
  reducedMotion,
  onZoomPhase,
}: GlobeControlsProps) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const interacting = useRef(false);
  const focusing = useRef(false);
  const wasMapOpen = useRef(false);
  const hasSelected = useRef(false);
  // 0 = idle, 1 = centering (rotate at overview distance), 2 = zooming (radius).
  const phase = useRef(0);
  const zoomInRadius = useRef(1.2);
  // Target camera position in spherical coords (radius, polar phi, azimuth theta).
  const target = useRef(new THREE.Spherical(OVERVIEW_RADIUS, Math.PI / 2, 0));
  const offset = useRef(new THREE.Vector3());
  const current = useRef(new THREE.Spherical());

  useEffect(() => {
    // selectNonce === 0 means the user hasn't picked anything yet → keep spinning.
    if (selectNonce === 0 || !focusLocation) return;
    const controls = controlsRef.current;
    const normal = latLngToPosition(focusLocation.lat, focusLocation.lng, 1).normalize();
    // Phase 1: rotate to center the point while staying at the overview distance.
    target.current.theta = Math.atan2(normal.x, normal.z);
    target.current.phi = Math.acos(THREE.MathUtils.clamp(normal.y, -1, 1));
    target.current.radius = OVERVIEW_RADIUS;
    zoomInRadius.current = controls ? controls.minDistance : 1.2;
    hasSelected.current = true;

    if (reducedMotion && controls) {
      // Snap straight to centered + zoomed-in and open the map immediately.
      target.current.radius = zoomInRadius.current;
      offset.current.setFromSpherical(target.current);
      controls.object.position.copy(controls.target).add(offset.current);
      controls.update();
      phase.current = 0;
      focusing.current = false;
      onZoomPhase();
    } else {
      phase.current = 1;
      focusing.current = true;
    }
    // Only re-run on an actual selection, not when activeLocation identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectNonce]);

  // When the detail map closes, pull the globe back out to the overview.
  useEffect(() => {
    if (wasMapOpen.current && !mapOpen && hasSelected.current) {
      target.current.radius = OVERVIEW_RADIUS; // keep angles, just zoom out
      const controls = controlsRef.current;
      if (reducedMotion && controls) {
        offset.current.setFromSpherical(target.current);
        controls.object.position.copy(controls.target).add(offset.current);
        controls.update();
        phase.current = 0;
        focusing.current = false;
      } else {
        phase.current = 2; // pure radius move, angles already aligned
        focusing.current = true;
      }
    }
    wasMapOpen.current = mapOpen;
  }, [mapOpen, reducedMotion]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.autoRotate =
      !interacting.current && !focusing.current && !reducedMotion && !hasSelected.current;

    if (focusing.current) {
      const damp = 1 - Math.pow(0.0018, delta); // frame-rate independent

      // Read the camera's current spherical position around the target.
      offset.current.copy(controls.object.position).sub(controls.target);
      current.current.setFromVector3(offset.current);

      let deltaTheta = target.current.theta - current.current.theta;
      deltaTheta = Math.atan2(Math.sin(deltaTheta), Math.cos(deltaTheta)); // shortest path
      const deltaPhi = target.current.phi - current.current.phi;
      const deltaRadius = target.current.radius - current.current.radius;

      current.current.theta += deltaTheta * damp;
      current.current.phi += deltaPhi * damp;
      current.current.radius += deltaRadius * damp;
      current.current.makeSafe();

      offset.current.setFromSpherical(current.current);
      controls.object.position.copy(controls.target).add(offset.current);

      const centered = Math.abs(deltaTheta) < 0.012 && Math.abs(deltaPhi) < 0.012;

      if (phase.current === 1) {
        // Centering done → begin the zoom-in and let the map dive in.
        if (centered) {
          phase.current = 2;
          target.current.radius = zoomInRadius.current;
          onZoomPhase();
        }
      } else if (phase.current === 2) {
        if (centered && Math.abs(deltaRadius) < 0.01) {
          phase.current = 0;
          focusing.current = false;
        }
      }
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableZoom={false}
      minDistance={1.2}
      maxDistance={3.4}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      autoRotateSpeed={0.35}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
      onStart={() => {
        interacting.current = true;
        focusing.current = false;
      }}
      onEnd={() => {
        interacting.current = false;
      }}
    />
  );
};

const GlobeCanvas = ({
  locations,
  activeId,
  selectNonce,
  mapOpen,
  onSelect,
  onZoomPhase,
  reducedMotion,
  isMobile,
  isDark,
}: GlobeCanvasProps) => {
  // The globe always centers on the marker location (Seattle); the other two
  // are so close it isn't noticeable, and it keeps the single dot centered.
  const focusLocation =
    locations.find((location) => location.id === GLOBE_MARKER_ID) ??
    locations.find((location) => location.id === activeId);

  const markers = useMemo(
    () =>
      locations
        .filter((location) => location.id === GLOBE_MARKER_ID)
        .map((location) => ({
          location,
          position: latLngToMarkerPosition(location.lat, location.lng),
        })),
    [locations],
  );

  return (
    <Canvas
      camera={{ position: [0, 0.2, 2.95], fov: 45, near: 0.05, far: 100 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <Earth isDark={isDark} isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>

      {markers.map(({ location, position }) => (
        <LocationMarker
          key={location.id}
          location={location}
          position={position}
          // The single globe dot is the beacon for whichever location is
          // selected, so it always renders at the active size (consistent
          // across all 3 locations) rather than only when its own id is active.
          isActive
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}

      <GlobeControls
        focusLocation={focusLocation}
        selectNonce={selectNonce}
        mapOpen={mapOpen}
        reducedMotion={reducedMotion}
        onZoomPhase={onZoomPhase}
      />
    </Canvas>
  );
};

export default GlobeCanvas;
