import { ArrowRight, MapPin } from "lucide-react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

type HeroSectionProps = {
  name: string;
  title: string;
  location: string;
  oneLiner: string;
  isDark: boolean;
};

const tacomaCoordinates: [number, number] = [47.2529, -122.4443];
const desktopMapCenter: [number, number] = [47.223, -122.555];
const mobileMapCenter: [number, number] = [47.223, -122.52];
const pulseMarkerIcon = L.divIcon({
  className: "heroPulseMarker",
  html: `<span class="heroPulseMarkerDot"></span><span class="heroPulseMarkerRing"></span>`,
  iconSize: [23, 23],
  iconAnchor: [3, -25],
});

const HeroSection = ({
  name,
  title,
  location,
  oneLiner,
  isDark,
}: HeroSectionProps) => {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const mapCenter = isMobile ? mobileMapCenter : desktopMapCenter;
  const badgeClasses = isDark
    ? "border-white/25 bg-black/45 text-white/85"
    : "border-zinc-300/80 bg-white/80 text-zinc-700";
  const headingClasses = isDark ? "text-zinc-100" : "text-zinc-900";
  const titleClasses = isDark ? "text-zinc-200" : "text-zinc-700";
  const subtitleClasses = isDark ? "text-zinc-300" : "text-zinc-600";

  return (
    <section
      id="hero"
      className="scroll-mt-20 pb-8 pt-8 md:scroll-mt-24 md:pb-14 md:pt-16"
    >
      <div className="heroMapFrame relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 z-0">
          <MapContainer
            key={isMobile ? "mobile-map" : "desktop-map"}
            center={mapCenter}
            zoom={11.4}
            className="h-full w-full"
            zoomControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
            keyboard={false}
            touchZoom={false}
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
            <Marker position={tacomaCoordinates} icon={pulseMarkerIcon} />
          </MapContainer>
        </div>

        <div className="heroMapGradient absolute inset-0 z-10 pointer-events-none" />

        <div
          className={`absolute bottom-4 right-4 z-20 pointer-events-none inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] backdrop-blur-sm ${badgeClasses}`}
        >
          <MapPin size={12} />
          {location}
        </div>

        <div className="relative z-20 min-h-[250px] px-4 py-6 md:min-h-[280px] md:px-6 md:py-8">
          <div className="max-w-md">
            {/* <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-100 md:mb-4 md:text-xs md:tracking-[0.2em]">
              {location}
            </p> */}
            <h1
              className={`text-4xl font-semibold tracking-tight md:text-6xl ${headingClasses}`}
            >
              {name}
            </h1>
            <p
              className={`mt-2 text-base font-medium md:mt-3 md:text-xl ${titleClasses}`}
            >
              {title}
            </p>
            <p
              className={`mt-1.5 max-w-2xl text-xs italic [font-family:'Fira_Code','JetBrains_Mono','IBM_Plex_Mono',Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace] leading-relaxed md:mt-2 md:text-sm ${subtitleClasses}`}
            >
              {oneLiner}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <a
          href="#projects"
          className="heroPrimaryCta inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition sm:w-auto"
        >
          View Projects <ArrowRight size={16} />
        </a>
        <a
          href="#contact"
          className="heroSecondaryCta inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition sm:w-auto"
        >
          Contact
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
