import { ExternalLink, Github } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import Section from "../ui/Section";
import type { Project } from "../../types/portfolio";

type ProjectsSectionProps = {
  projects: Project[];
};

const getCoverClasses = (name: string) => {
  const key = name.toLowerCase();
  if (key.includes("gear")) return "from-zinc-950 via-zinc-900 to-zinc-800";
  if (key.includes("pass")) return "from-zinc-900 via-zinc-800 to-zinc-700";
  if (key.includes("resume")) return "from-zinc-950 via-zinc-850 to-zinc-800";
  return "from-zinc-900 via-zinc-800 to-zinc-700";
};

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="Featured builds with concrete outcomes."
    >
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {projects.map((project, index) => (
          <article
            key={project.name}
            className="projectCardGlow group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p
              className={[
                "px-4 pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100",
                index === 0 ? "" : "invisible",
              ].join(" ")}
            >
              Featured
            </p>

            <div
              className={[
                "relative mx-4 mt-4 overflow-hidden rounded-lg border border-zinc-200/70 bg-gradient-to-br",
                "h-[140px] md:h-[160px]",
                "dark:border-zinc-800/70",
                getCoverClasses(project.name),
              ].join(" ")}
            >
              {project.image ? (
                <div className="absolute inset-0">
                  <img
                    src={project.image}
                    alt={`${project.name} preview`}
                    loading="lazy"
                    className="h-full w-full object-contain scale-90 md:scale-95"
                  />
                </div>
              ) : (
                <>
                  {/* Decorative fallback when no project image exists */}
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(circle_at_30%_30%,black,transparent_65%)]" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute left-3 top-3 flex items-center gap-2 opacity-80">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-1 flex-col px-4 pb-4">
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-900 dark:text-zinc-100">
                {project.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {project.summary}
              </p>

              {project.note ? (
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {project.note}
                </p>
              ) : null}

              <div className="mt-auto pt-4 flex flex-wrap gap-3">
                {project.liveDemo ? (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                ) : null}
                {project.linkedin ? (
                  <a
                    href={project.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100"
                  >
                    <FaLinkedin size={14} />
                    LinkedIn
                  </a>
                ) : null}
                {project.repository ? (
                  <a
                    href={project.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;
