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
    <div className="relative min-h-screen bg-black text-zinc-100">
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
        </div>
      </header>

      <HeroSection
        name={portfolioData.name}
        title={portfolioData.title}
        oneLiner={portfolioData.oneLiner}
      />

      <main className="mx-auto w-full max-w-[66.9375rem] px-3 pb-10 pt-8 md:px-6 md:pb-16 md:pt-12">
        <StackSection stack={portfolioData.stack} />
        <div className="lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-10">
          <GlobeSection ref={globeRef} locations={portfolioData.globeLocations} />
          <AboutSection
            paragraphs={portfolioData.about}
            onSelectLocation={selectGlobeLocation}
          />
        </div>
        <div className="mx-auto w-full max-w-[47.8125rem]">
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
        </div>
      </main>
    </div>
  );
};

export default App;
