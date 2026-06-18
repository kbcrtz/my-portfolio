import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

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
    <section id="hero" className="relative scroll-mt-16 md:scroll-mt-20">
      <video
        ref={videoRef}
        className="block aspect-[2.55/1] min-h-[340px] w-full object-cover object-[50%_60%]"
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

      {/* Headline + CTAs, aligned to the content column. */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto w-full max-w-[38.25rem] px-3 pb-6 md:px-6 md:pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {name}
          </h1>
          <p className="mt-2 text-base font-medium text-zinc-100 md:mt-3 md:text-xl">
            {title}
          </p>
          <p className="mt-1.5 max-w-xl text-xs italic leading-relaxed text-zinc-300 [font-family:'Fira_Code','JetBrains_Mono','IBM_Plex_Mono',Menlo,Monaco,Consolas,'Liberation_Mono','Courier_New',monospace] md:mt-2 md:text-sm">
            {oneLiner}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <a
              href="#projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:w-auto"
            >
              View Projects <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/50 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
