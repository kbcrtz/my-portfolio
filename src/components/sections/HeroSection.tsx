import { useEffect, useRef } from "react";

// Wide, shallow chevron for the scroll cue; lucide's is too narrow.
const WideChevron = () => (
  <svg width="32" height="11" viewBox="0 0 44 14" fill="none" aria-hidden="true">
    <path
      d="M2 2l20 10L42 2"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const brandText = "kobe cortez";
const isVowel = (char: string) => "aeiou".includes(char.toLowerCase());

type HeroSectionProps = {
  name: string;
  title: string;
  oneLiner: string;
};

const HeroSection = ({ name, title, oneLiner }: HeroSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React's `muted` attribute doesn't reliably set the muted *property*, and
    // iOS only autoplays / auto-resumes video it considers genuinely muted.
    // Forcing it here is what lets the video pick back up without a tap.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    // Respect reduced-motion: hold on the poster frame instead of looping.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    // Mobile browsers pause muted autoplay video when the app is backgrounded.
    // Re-play when the page becomes visible / regains focus; touch & pointer
    // are kept as a guaranteed user-gesture fallback.
    const tryPlay = () => {
      if (document.visibilityState === "visible" && video.paused) {
        void video.play().catch(() => {});
      }
    };

    void video.play().catch(() => {});
    document.addEventListener("visibilitychange", tryPlay);
    window.addEventListener("focus", tryPlay);
    window.addEventListener("pageshow", tryPlay);
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("touchstart", tryPlay, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", tryPlay);
      window.removeEventListener("focus", tryPlay);
      window.removeEventListener("pageshow", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, []);

  return (
    <section id="hero" className="relative h-svh scroll-mt-16 md:scroll-mt-20">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[50%_60%]"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/hero-banner-poster.jpg"
      >
        <source src="/hero-banner.mp4" type="video/mp4" />
      </video>

      {/* Dark scrim (top for the nav, bottom for the headline) over the footage. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/55" />

      {/* Brand, pinned to the section's top-left like the other section labels. */}
      <a
        href="#hero"
        className="absolute left-3 top-3 z-10 text-sm font-semibold tracking-tight text-white md:left-6 md:top-6 md:text-base"
      >
        <span className="sr-only">kbcrtz</span>
        <span aria-hidden="true" className="brandMorph">
          {brandText.split("").map((char, index) => {
            const isSpace = char === " ";
            const className = [
              "brandMorphChar",
              isSpace ? "brandMorphSpace" : isVowel(char) ? "brandMorphVowel" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <span key={`${char}-${index}`} className={className}>
                {char}
              </span>
            );
          })}
        </span>
      </a>

      {/* Headline + CTAs, aligned to the content column. */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[38.25rem] px-3 pb-10 md:px-6 md:pb-16">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {name}
          </h1>
          <p className="mt-2 text-base font-medium text-zinc-100 md:mt-3 md:text-xl">
            {title}
          </p>
          <p className="mt-1.5 max-w-xl text-xs italic leading-relaxed text-zinc-300 [font-family:'Fira_Code','JetBrains_Mono','IBM_Plex_Mono',Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace] md:mt-2 md:text-sm">
            {/* Words wrapped in *asterisks* in the data render emphasized. */}
            {oneLiner.split(/\*([^*]+)\*/g).map((part, index) =>
              index % 2 === 1 ? (
                <em key={index} className="text-white">
                  {part}
                </em>
              ) : (
                part
              ),
            )}
          </p>
        </div>
      </div>

      {/* Scroll cue. Bounce lives on the inner element so it doesn't fight the
          centering translate on the outer one. */}
      <div className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#stack"
          aria-label="Scroll to my toolkit"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("stack")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex animate-[bounce_2.8s_ease-in-out_infinite] flex-col items-center gap-0.5 p-2 text-white/50 transition hover:text-white"
        >
          <WideChevron />
          <WideChevron />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
