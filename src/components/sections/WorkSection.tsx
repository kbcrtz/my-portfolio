import { useState } from "react";
import { ArrowUpRight, ChevronDown, Github } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Section from "../ui/Section";
import Reveal from "../ui/Reveal";
import type { Project } from "../../types/portfolio";

type WorkSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  projects: Project[];
};

const stop = (event: React.MouseEvent) => event.stopPropagation();

const WorkSection = ({ id, title, subtitle, projects }: WorkSectionProps) => {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const toggle = (index: number) =>
    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <Section id={id} title={title} subtitle={subtitle}>
      <div className="border-t border-zinc-200 dark:border-zinc-800/80">
        {projects.map((project, index) => {
          const primaryLink =
            project.liveDemo ?? project.repository ?? project.linkedin;
          const hasDetails = Boolean(project.bullets?.length);
          const isOpen = Boolean(open[index]);
          const panelId = `${id}-panel-${index}`;

          return (
            <Reveal key={project.name} delay={index * 70}>
              <article className="group border-b border-zinc-200 dark:border-zinc-800/80">
                <div
                  {...(hasDetails
                    ? {
                        role: "button" as const,
                        tabIndex: 0,
                        "aria-expanded": isOpen,
                        "aria-controls": panelId,
                        onClick: () => toggle(index),
                        onKeyDown: (event: React.KeyboardEvent) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            toggle(index);
                          }
                        },
                      }
                    : {})}
                  className={`flex items-start gap-4 py-6 md:gap-5 md:py-8 ${
                    hasDetails ? "cursor-pointer" : ""
                  }`}
                >
                  <span className="mt-1.5 font-mono text-[11px] text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-semibold tracking-tight text-zinc-900 transition-transform duration-300 ease-out group-hover:translate-x-1 dark:text-zinc-100 md:text-2xl">
                        {primaryLink ? (
                          <a
                            href={primaryLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={stop}
                            className="outline-none focus-visible:underline"
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                      </h3>
                      {hasDetails ? (
                        <ChevronDown
                          size={20}
                          className={`mt-1 shrink-0 text-zinc-400 transition-all duration-300 group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      ) : primaryLink ? (
                        <ArrowUpRight
                          size={20}
                          className="mt-1 shrink-0 text-zinc-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-100"
                        />
                      ) : null}
                    </div>

                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {project.summary}
                    </p>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                      {project.stack.join(" · ")}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-5">
                      {project.liveDemo ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={stop}
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          Live <ArrowUpRight size={13} />
                        </a>
                      ) : null}
                      {project.repository ? (
                        <a
                          href={project.repository}
                          target="_blank"
                          rel="noreferrer"
                          onClick={stop}
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          <Github size={13} /> GitHub
                        </a>
                      ) : null}
                      {project.linkedin ? (
                        <a
                          href={project.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          onClick={stop}
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          <FaLinkedin size={13} /> LinkedIn
                        </a>
                      ) : null}
                    </div>

                    {hasDetails ? (
                      <div
                        id={panelId}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <ul className="space-y-2.5 pt-5">
                            {project.bullets?.map((bullet) => (
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
                    ) : null}
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

export default WorkSection;
