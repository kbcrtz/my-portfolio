import { ArrowUpRight, Github } from "lucide-react";
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

const WorkSection = ({ id, title, subtitle, projects }: WorkSectionProps) => {
  return (
    <Section id={id} title={title} subtitle={subtitle}>
      <div className="border-t border-zinc-200 dark:border-zinc-800/80">
        {projects.map((project, index) => {
          const primaryLink =
            project.liveDemo ?? project.repository ?? project.linkedin;

          return (
            <Reveal key={project.name} delay={index * 70}>
              <article className="group relative border-b border-zinc-200 py-6 dark:border-zinc-800/80 md:py-8">
                <div className="flex items-start gap-4 md:gap-5">
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
                            className="outline-none after:absolute after:inset-0 focus-visible:underline"
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                      </h3>
                      {primaryLink ? (
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

                    <div className="relative z-10 mt-4 flex flex-wrap gap-5">
                      {project.liveDemo ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
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
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600 underline-offset-4 transition hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          <FaLinkedin size={13} /> LinkedIn
                        </a>
                      ) : null}
                    </div>
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
