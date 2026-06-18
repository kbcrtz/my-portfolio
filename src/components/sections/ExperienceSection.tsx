import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import type { ExperienceItem } from "../../types/portfolio";

type ExperienceSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  items: ExperienceItem[];
};

const ExperienceSection = ({
  id,
  title,
  subtitle,
  items,
}: ExperienceSectionProps) => {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const toggle = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <Section id={id} title={title} subtitle={subtitle}>
      <div className="border-t border-zinc-200 dark:border-zinc-800/80">
        {items.map((item, index) => {
          const isOpen = Boolean(open[index]);
          const panelId = `${id}-panel-${index}`;

          return (
            <Reveal key={`${item.org}-${item.role}`} delay={index * 70}>
              <article className="border-b border-zinc-200 dark:border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group flex w-full items-start justify-between gap-4 py-6 text-left md:py-8"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                      {item.period} · {item.location}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-2xl">
                      {item.org}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {item.role}
                    </p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`mt-1 shrink-0 text-zinc-400 transition-transform duration-300 group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={panelId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-2.5 pb-6 md:pb-8">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
                        >
                          <span className="mt-[9px] h-px w-4 shrink-0 bg-zinc-400 dark:bg-zinc-600" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};

export default ExperienceSection;
