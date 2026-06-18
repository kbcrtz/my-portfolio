import { Fragment } from "react";
import Section from "../ui/Section";

type AboutSectionProps = {
  paragraphs: string[];
  onSelectLocation: (id: string) => void;
};

// Phrases in the About copy that act as globe controls. Longest first so the
// alternation matches "Pacific Lutheran University" before any shorter overlap.
const LOCATION_LINKS = [
  { phrase: "Pacific Lutheran University", id: "plu" },
  { phrase: "Puyallup", id: "puyallup" },
  { phrase: "Seattle", id: "seattle" },
];

const linkPattern = new RegExp(`(${LOCATION_LINKS.map((l) => l.phrase).join("|")})`, "g");

const AboutSection = ({ paragraphs, onSelectLocation }: AboutSectionProps) => {
  return (
    <Section id="about" title="About">
      <div className="max-w-3xl space-y-3 text-sm text-zinc-300 md:space-y-4 md:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph.split(linkPattern).map((part, index) => {
              const link = LOCATION_LINKS.find((location) => location.phrase === part);
              if (!link) return <Fragment key={index}>{part}</Fragment>;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectLocation(link.id)}
                  className="font-bold text-zinc-100 underline underline-offset-2 transition hover:text-white"
                >
                  {part}
                </button>
              );
            })}
          </p>
        ))}
      </div>
    </Section>
  );
};

export default AboutSection;
