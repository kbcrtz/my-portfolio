import { ArrowLeft } from "lucide-react";
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import type { GlobeLocation } from "../../types/portfolio";
import LocationPanel from "../globe/LocationPanel";
import Reveal from "../ui/Reveal";

const GlobeCanvas = lazy(() => import("../globe/GlobeCanvas"));
const LocationMap = lazy(() => import("../globe/LocationMap"));

// Extra beat after the globe starts zooming before the Leaflet map fades in.
const MAP_FADE_DELAY_MS = 100;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};

const GlobePoster = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="globePoster h-2/3 w-2/3 rounded-full" />
  </div>
);

type GlobeSectionProps = {
  locations: GlobeLocation[];
  isDark: boolean;
};

const GlobeSection = ({ locations, isDark }: GlobeSectionProps) => {
  const defaultId =
    locations.find((location) => location.isDefault)?.id ?? locations[0]?.id ?? "";
  const [activeId, setActiveId] = useState(defaultId);
  // Increments on every user selection; the canvas focuses + stops idle spin
  // when this changes (the initial value of 0 means "untouched, keep spinning").
  const [selectNonce, setSelectNonce] = useState(0);
  const [shouldMount, setShouldMount] = useState(false);
  // null = globe overview; an id = the Leaflet detail map for that location.
  const [mapLocationId, setMapLocationId] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mapOpenRef = useRef(false);
  const activeIdRef = useRef(defaultId);
  const fadeTimer = useRef<number>();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    mapOpenRef.current = mapLocationId !== null;
  }, [mapLocationId]);

  const onSelect = useCallback((id: string) => {
    setActiveId(id);
    activeIdRef.current = id;
    setSelectNonce((nonce) => nonce + 1);
    // If a detail map is already open, fly it straight to the new place.
    // Otherwise the globe centers + zooms first and opens the map via onZoomPhase.
    if (mapOpenRef.current) {
      window.clearTimeout(fadeTimer.current);
      setMapLocationId(id);
    }
  }, []);

  // Fired by the globe once it has centered and starts zooming in. A short beat
  // later the Leaflet map dives in, so the centering happens first and in full view.
  const onZoomPhase = useCallback(() => {
    window.clearTimeout(fadeTimer.current);
    fadeTimer.current = window.setTimeout(() => {
      if (!mapOpenRef.current) {
        setMapLocationId(activeIdRef.current);
      }
    }, MAP_FADE_DELAY_MS);
  }, []);

  const closeMap = useCallback(() => {
    window.clearTimeout(fadeTimer.current);
    setMapLocationId(null);
  }, []);

  useEffect(() => () => window.clearTimeout(fadeTimer.current), []);

  const mapLocation =
    locations.find((location) => location.id === mapLocationId) ?? undefined;

  // Defer mounting the WebGL canvas until the section is near the viewport so
  // three.js never costs anything on initial load (the section is below the fold).
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="globe" className="scroll-mt-20 py-8 md:scroll-mt-24 md:py-14">
      <Reveal>
        <div className="flex flex-col gap-4">
          <div ref={frameRef} className="relative overflow-hidden rounded-lg">
            <div className="relative aspect-square w-full sm:aspect-[4/3]">
              <Suspense fallback={<GlobePoster />}>
                {shouldMount ? (
                  <GlobeCanvas
                    locations={locations}
                    activeId={activeId}
                    selectNonce={selectNonce}
                    mapOpen={mapLocation !== undefined}
                    onSelect={onSelect}
                    onZoomPhase={onZoomPhase}
                    reducedMotion={reducedMotion}
                    isMobile={isMobile}
                    isDark={isDark}
                  />
                ) : (
                  <GlobePoster />
                )}
              </Suspense>

              {mapLocation ? (
                <div className="globeMapOverlay absolute inset-0 z-20">
                  <Suspense fallback={null}>
                    <LocationMap
                      location={mapLocation}
                      isDark={isDark}
                      reducedMotion={reducedMotion}
                    />
                  </Suspense>
                  <button
                    type="button"
                    onClick={closeMap}
                    className="absolute left-3 top-3 z-[1000] inline-flex items-center gap-1.5 rounded-full border border-zinc-300/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-800 backdrop-blur transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-zinc-100"
                  >
                    <ArrowLeft size={14} /> Globe
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <LocationPanel locations={locations} activeId={activeId} onSelect={onSelect} />
        </div>
      </Reveal>
    </section>
  );
};

export default GlobeSection;
