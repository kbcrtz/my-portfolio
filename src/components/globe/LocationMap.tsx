import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import type { GlobeLocation } from "../../types/portfolio";

const CITY_ZOOM = 12;
// Start a bit more zoomed-out so the map picks up roughly where the globe dive
// left off, then flies the rest of the way into the city — one continuous zoom.
// Lower than CITY_ZOOM purely to give the entrance more zoom-in travel; the
// final/target zoom (CITY_ZOOM) and center are unchanged.
const START_ZOOM = 5.5;

const markerIcon = L.divIcon({
  className: "globeMapMarker",
  html: `<span class="globeMapMarkerDot"></span><span class="globeMapMarkerRing"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Drops Leaflet's own "Leaflet" prefix link; only the tile credit is required. */
const NoAttributionPrefix = () => {
  const map = useMap();
  useEffect(() => {
    map.attributionControl?.setPrefix(false);
  }, [map]);
  return null;
};

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

// Set VITE_CARTO_KEY in .env.local (gitignored). Without it the map falls back to Esri.
const CARTO_KEY = import.meta.env.VITE_CARTO_KEY as string | undefined;
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
  '&copy; <a href="https://carto.com/attribution/">CARTO</a>';

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
      attributionControl
    >
      {/* Layers are keyed on theme so they remount when the URL changes. */}
      {CARTO_KEY ? (
        <TileLayer
          key={isDark ? "carto-dark" : "carto-light"}
          url={`https://basemaps.cartocdn.com/rastertiles/${
            isDark ? "dark_all" : "light_all"
          }/{z}/{x}/{y}{r}.png?key=${CARTO_KEY}`}
          attribution={CARTO_ATTRIBUTION}
          className={isDark ? "cartoDarkTiles" : undefined}
          maxNativeZoom={18}
        />
      ) : (
        <>
          {/* Keyless fallback: Esri gray canvas base + its separate label overlay. */}
          <TileLayer
            key={isDark ? "esri-dark" : "esri-light"}
            url={`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${
              isDark ? "Dark" : "Light"
            }_Gray_Base/MapServer/tile/{z}/{y}/{x}`}
            attribution="Tiles &copy; Esri"
            maxNativeZoom={16}
          />
          <TileLayer
            key={isDark ? "esri-dark-labels" : "esri-light-labels"}
            url={`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${
              isDark ? "Dark" : "Light"
            }_Gray_Reference/MapServer/tile/{z}/{y}/{x}`}
            maxNativeZoom={16}
          />
        </>
      )}
      <NoAttributionPrefix />
      <Marker position={[location.lat, location.lng]} icon={markerIcon} />
      <FlyTo lat={location.lat} lng={location.lng} reducedMotion={reducedMotion} />
    </MapContainer>
  );
};

export default LocationMap;
