import Section from "../ui/Section";

type AboutSectionProps = {
  paragraphs: string[];
};

const AboutSection = ({ paragraphs }: AboutSectionProps) => {
  return (
    <Section id="about" title="About">
      <div className="max-w-3xl space-y-3 text-sm text-zinc-700 dark:text-zinc-300 md:space-y-4 md:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  );
};

export default AboutSection;
