import { useEffect, useState } from "react";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import HeroSection from "./components/sections/HeroSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import StackSection from "./components/sections/StackSection";
import ThemeToggle from "./components/ui/ThemeToggle";
import { portfolioData } from "./data/portfolio";

const headerBrandText = "kobe cortez";
const isVowel = (char: string) => "aeiou".includes(char.toLowerCase());

const App = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextIsDark = stored ? stored === "dark" : prefersDark;
    setIsDark(nextIsDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="relative mx-auto flex w-full max-w-[38.25rem] items-center justify-between px-3 py-2.5 md:px-6 md:py-3">
          <a href="#hero" className="text-sm font-semibold tracking-tight md:text-base">
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
                className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[38.25rem] px-3 pb-10 md:px-6 md:pb-16">
        <HeroSection
          name={portfolioData.name}
          title={portfolioData.title}
          location={portfolioData.location}
          oneLiner={portfolioData.oneLiner}
          isDark={isDark}
        />
        <StackSection stack={portfolioData.stack} />
        <AboutSection paragraphs={portfolioData.about} />
        <ProjectsSection projects={portfolioData.projects} />
        <ContactSection links={portfolioData.contactLinks} />
      </main>
    </div>
  );
};

export default App;
