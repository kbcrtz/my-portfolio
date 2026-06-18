import { Line } from "@react-three/drei";
import { useMemo } from "react";
import type { GlobeLocation } from "../../types/portfolio";
import { greatCircleArcPoints } from "./latLngToPosition";

type LocationArcsProps = {
  locations: GlobeLocation[];
};

/** Draws subtle arcs connecting the locations in narrative order. */
const LocationArcs = ({ locations }: LocationArcsProps) => {
  const arcs = useMemo(() => {
    const segments = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const from = locations[i];
      const to = locations[i + 1];
      segments.push({
        key: `${from.id}-${to.id}`,
        points: greatCircleArcPoints(from, to),
        color: to.accentColor,
      });
    }
    return segments;
  }, [locations]);

  return (
    <>
      {arcs.map((arc) => (
        <Line
          key={arc.key}
          points={arc.points}
          color={arc.color}
          lineWidth={1.5}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      ))}
    </>
  );
};

export default LocationArcs;
