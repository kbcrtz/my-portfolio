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

// The carousel cycles on its own until the user takes over.
const AUTO_ADVANCE_MS = 4500;

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
  const [autoPlay, setAutoPlay] = useState(true);
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

  // Track actual visibility separately so auto-advance pauses offscreen.
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoPlay || !inView || !shouldMount || reducedMotion) return;
    const id = window.setInterval(
      () => setActiveIndex((index) => (index + 1) % stack.length),
      AUTO_ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [autoPlay, inView, shouldMount, reducedMotion, stack.length]);

  const select = useCallback(
    (index: number) => {
      setAutoPlay(false);
      setActiveIndex((index + stack.length) % stack.length);
    },
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
    <div className="-mt-2 mb-6 md:-mt-4 md:mb-10">
      <div ref={frameRef} className="relative overflow-hidden rounded-lg bg-black">
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
          {shouldMount ? (
            <Suspense fallback={null}>
              <StackStarCanvas
                items={stack}
                activeIndex={activeIndex}
                reducedMotion={reducedMotion}
                isMobile={isMobile}
              />
            </Suspense>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent pb-2 pt-10 md:pb-2.5">
          <div className="flex items-center gap-0.5 px-1.5 md:px-2">
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
    </div>
  );
};

export default StackSection;
