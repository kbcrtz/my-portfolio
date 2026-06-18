import * as THREE from "three";

const DEG2RAD = Math.PI / 180;

/**
 * Globe sphere radius in scene units. Markers/arcs are offset above this so
 * they sit on the surface rather than clipping into it.
 */
export const GLOBE_RADIUS = 1;

/** Fraction of the radius to lift markers above the surface. */
export const MARKER_RADIUS_OFFSET = 0.02;

/**
 * Convert geographic coordinates to a 3D position on a sphere of the given
 * radius, matching the UV layout of a THREE.SphereGeometry wrapped with an
 * equirectangular (NASA Blue Marble) texture.
 *
 * NOTE: the X sign and the `lng + 180` theta offset are the texture-orientation
 * knobs. They are validated empirically by confirming the PNW markers land on
 * the US west coast (not its mirror in Asia). If the map ever reads mirrored,
 * flip the X sign here.
 */
export function latLngToPosition(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS,
): THREE.Vector3 {
  const phi = (90 - lat) * DEG2RAD; // polar angle from +Y
  const theta = (lng + 180) * DEG2RAD; // azimuth
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

/** Marker position lifted slightly above the globe surface. */
export function latLngToMarkerPosition(
  lat: number,
  lng: number,
  radius: number = GLOBE_RADIUS,
): THREE.Vector3 {
  return latLngToPosition(lat, lng, radius * (1 + MARKER_RADIUS_OFFSET));
}

const FORWARD = new THREE.Vector3(0, 0, 1); // toward the camera (+Z)

/**
 * Quaternion that rotates the globe group so the surface point at (lat, lng)
 * faces the camera. Applied via slerp in the Earth's useFrame loop.
 */
export function focusQuaternion(lat: number, lng: number): THREE.Quaternion {
  const surfaceNormal = latLngToPosition(lat, lng, 1).normalize();
  return new THREE.Quaternion().setFromUnitVectors(surfaceNormal, FORWARD);
}

/**
 * Great-circle arc points between two coordinates, lifted above the surface so
 * the arc bows outward from the globe. Used by LocationArcs.
 */
export function greatCircleArcPoints(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  segments = 48,
  lift = 0.18,
): THREE.Vector3[] {
  const from = latLngToPosition(start.lat, start.lng, 1);
  const to = latLngToPosition(end.lat, end.lng, 1);
  const angle = from.angleTo(to);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Spherical interpolation between the two surface points.
    const point = new THREE.Vector3().copy(from).lerp(to, t).normalize();
    // Lift the midpoint of the arc above the surface (parabola-like bow).
    const bow = Math.sin(t * Math.PI) * lift * Math.max(angle, 0.25);
    point.multiplyScalar(GLOBE_RADIUS * (1 + MARKER_RADIUS_OFFSET) + bow);
    points.push(point);
  }

  return points;
}
