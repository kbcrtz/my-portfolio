import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { StackItem } from "../../types/portfolio";

const StackStarCanvas = lazy(() => import("../stack/StackStarCanvas"));

// Dwell time on each logo. Manual selection resets the clock rather than
// stopping the rotation — the carousel always keeps cycling while visible.
const AUTO_ADVANCE_MS = 3500;

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

type StackSectionProps = {
  stack: StackItem[];
};

const StackSection = ({ stack }: StackSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [shouldMount, setShouldMount] = useState(false);
  const [inView, setInView] = useState(false);
  // Stars stay scattered until the section is first seen, so the visitor
  // watches them assemble into the first logo. Never flips back off.
  const [started, setStarted] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Defer mounting the WebGL canvas until the section is near the viewport so
  // three.js never costs anything on initial load.
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

  // Track actual visibility separately so auto-advance pauses offscreen, and
  // kick off the first logo formation the first time the section is seen.
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // A timeout keyed on activeIndex (rather than an interval) means every
  // change — automatic or user-selected — gets the full dwell time before
  // the carousel moves on.
  useEffect(() => {
    if (!started || !inView || !shouldMount || reducedMotion) return;
    const id = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % stack.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearTimeout(id);
  }, [activeIndex, started, inView, shouldMount, reducedMotion, stack.length]);

  const select = useCallback(
    (index: number) => setActiveIndex((index + stack.length) % stack.length),
    [stack.length],
  );

  // Keep the active name centered in the strip.
  useEffect(() => {
    const list = listRef.current;
    const item = itemRefs.current[activeIndex];
    if (!list || !item) return;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
  }, [activeIndex, reducedMotion]);

  return (
    <section id="stack" className="relative bg-black px-3 py-6 md:h-svh md:p-0">
      <div
        ref={frameRef}
        className="relative h-full w-full overflow-hidden rounded-lg md:rounded-none"
      >
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full">
          {shouldMount ? (
            <Suspense fallback={null}>
              <StackStarCanvas
                items={stack}
                activeIndex={activeIndex}
                formLogos={started}
                reducedMotion={reducedMotion}
                isMobile={isMobile}
              />
            </Suspense>
          ) : null}
        </div>

        {/* Section label, kept subtle so the star canvas stays the focus. */}
        <p className="pointer-events-none absolute left-3 top-3 z-10 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 md:left-6 md:top-6">
          my toolkit
        </p>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent pb-2 pt-10 md:pb-2.5">
          <div className="mx-auto flex w-full max-w-[66.9375rem] items-center gap-0.5 px-1.5 md:px-2">
            <button
              type="button"
              aria-label="Previous technology"
              onClick={() => select(activeIndex - 1)}
              className="shrink-0 rounded-full p-1.5 text-zinc-500 transition hover:text-zinc-100"
            >
              <ChevronLeft size={15} />
            </button>

            <div
              ref={listRef}
              className="stackCarouselList flex flex-1 items-center gap-0.5 overflow-x-auto px-1"
            >
              {stack.map((item, index) => {
                const active = index === activeIndex;
                return (
                  <button
                    key={item.name}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    aria-pressed={active}
                    onClick={() => select(index)}
                    className={`shrink-0 whitespace-nowrap rounded-full px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      active ? "" : "text-zinc-500 hover:text-zinc-200"
                    }`}
                    style={
                      active
                        ? {
                            color: item.color,
                            textShadow: `0 0 16px ${item.color}99`,
                          }
                        : undefined
                    }
                  >
                    <span
                      aria-hidden="true"
                      className={active ? "opacity-90" : "opacity-0"}
                    >
                      [&nbsp;
                    </span>
                    {item.name}
                    <span
                      aria-hidden="true"
                      className={active ? "opacity-90" : "opacity-0"}
                    >
                      &nbsp;]
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next technology"
              onClick={() => select(activeIndex + 1)}
              className="shrink-0 rounded-full p-1.5 text-zinc-500 transition hover:text-zinc-100"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StackSection;
