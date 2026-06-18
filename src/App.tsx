import { useCallback, useRef } from "react";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import GlobeSection, { type GlobeHandle } from "./components/sections/GlobeSection";
import HeroSection from "./components/sections/HeroSection";
import StackSection from "./components/sections/StackSection";
import WorkSection from "./components/sections/WorkSection";
import { portfolioData } from "./data/portfolio";

const headerBrandText = "kobe cortez";
const isVowel = (char: string) => "aeiou".includes(char.toLowerCase());

const App = () => {
  const globeRef = useRef<GlobeHandle>(null);

  // Clicking a location word in the About copy scrolls to the globe and dives it.
  const selectGlobeLocation = useCallback((id: string) => {
    document.getElementById("globe")?.scrollIntoView({ behavior: "smooth", block: "start" });
    globeRef.current?.select(id);
  }, []);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-10 md:py-6">
          <a href="#hero" className="text-sm font-semibold tracking-tight text-white md:text-base">
            <span className="sr-only">kbcrtz</span>
            <span aria-hidden="true" className="brandMorph">
              {headerBrandText.split("").map((char, index) => {
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
          <nav
            aria-label="Primary"
            className="hidden items-center gap-5 md:absolute md:left-1/2 md:flex md:-translate-x-1/2"
          >
            {portfolioData.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <HeroSection
        name={portfolioData.name}
        title={portfolioData.title}
        oneLiner={portfolioData.oneLiner}
      />

      <main className="mx-auto w-full max-w-[38.25rem] px-3 pb-10 pt-8 md:px-6 md:pb-16 md:pt-12">
        <StackSection stack={portfolioData.stack} />
        <GlobeSection ref={globeRef} locations={portfolioData.globeLocations} />
        <AboutSection
          paragraphs={portfolioData.about}
          onSelectLocation={selectGlobeLocation}
        />
        <ExperienceSection
          id="experience"
          title="Experience"
          items={portfolioData.experience}
        />
        <WorkSection
          id="projects"
          title="Projects"
          projects={portfolioData.projects}
        />
        <ExperienceSection
          id="leadership"
          title="Leadership"
          items={portfolioData.leadership}
        />
        <ContactSection links={portfolioData.contactLinks} />
      </main>
    </div>
  );
};

export default App;
