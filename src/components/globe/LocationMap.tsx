import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { GlobeLocation } from "../../types/portfolio";

const CITY_ZOOM = 12;
// Start a bit more zoomed-out so the map picks up roughly where the globe dive
// left off, then flies the rest of the way into the city — one continuous zoom.
// Lower than CITY_ZOOM purely to give the entrance more zoom-in travel; the
// final/target zoom (CITY_ZOOM) and center are unchanged.
const START_ZOOM = 5;

const markerIcon = L.divIcon({
  className: "globeMapMarker",
  html: `<span class="globeMapMarkerDot"></span><span class="globeMapMarkerRing"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Flies the map to the location whenever it changes — the "dive" zoom-in. */
const FlyTo = ({
  lat,
  lng,
  reducedMotion,
}: {
  lat: number;
  lng: number;
  reducedMotion: boolean;
}) => {
  const map = useMap();
  useEffect(() => {
    if (reducedMotion) {
      map.setView([lat, lng], CITY_ZOOM, { animate: false });
    } else {
      map.flyTo([lat, lng], CITY_ZOOM, { duration: 1.6 });
    }
  }, [map, lat, lng, reducedMotion]);
  return null;
};

type LocationMapProps = {
  location: GlobeLocation;
  isDark: boolean;
  reducedMotion: boolean;
};

const LocationMap = ({ location, isDark, reducedMotion }: LocationMapProps) => {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={START_ZOOM}
      className="h-full w-full"
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      attributionControl={false}
    >
      <TileLayer
        url={
          isDark
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
        subdomains="abcd"
      />
      <Marker position={[location.lat, location.lng]} icon={markerIcon} />
      <FlyTo lat={location.lat} lng={location.lng} reducedMotion={reducedMotion} />
    </MapContainer>
  );
};

export default LocationMap;
