import type { CSSProperties } from "react";
import type { GlobeLocation } from "../../types/portfolio";

type LocationPanelProps = {
  locations: GlobeLocation[];
  activeId: string;
  onSelect: (id: string) => void;
};

const LocationPanel = ({ locations, activeId, onSelect }: LocationPanelProps) => {
  const active = locations.find((location) => location.id === activeId);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label="Story locations"
        className="flex flex-col gap-2 sm:flex-row"
      >
        {locations.map((location) => {
          const isActive = location.id === activeId;
          return (
            <button
              key={location.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(location.id)}
              style={{ ["--loc-accent" as keyof CSSProperties]: location.accentColor } as CSSProperties}
              className={`globeLocationButton group flex min-h-[44px] w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition sm:flex-1 ${
                isActive
                  ? "globeLocationButtonActive border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
              }`}
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {location.title}
                </span>
                {location.subtitle ? (
                  <span className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {location.subtitle}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="min-h-[3.5rem] text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
      >
        {active?.story}
      </p>
    </div>
  );
};

export default LocationPanel;
