import {
  SiDocker,
  SiExpo,
  SiPostgresql,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si";
import { FaAws, FaJava } from "react-icons/fa";
import type { PortfolioData } from "../types/portfolio";

export const portfolioData: PortfolioData = {
  name: "Kobe Cortez",
  title: "Full Stack Software Engineer",
  location: "Tacoma, WA",
  oneLiner: "Building B2C Applications",
  about: [
    "Hey! I'm a third year Computer Science student at Pacific Lutheran University focused on building practical software that solves real problems.",
    "My work centers on full-stack applications across React/React Native, TypeScript, Spring Boot, and PostgreSQL, with product-minded execution from architecture to deployment.",
    "I enjoy shipping user-ready experiences that balance clean engineering with measurable results.",
  ],
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  stack: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Expo", icon: SiExpo, color: "#7C5CFF" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "Java", icon: FaJava, color: "#F89820" },
    { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "AWS", icon: FaAws, color: "#FF9900" },
  ],
  projects: [
    {
      name: "Gear Fitness",
      summary: "Production fitness app for 50+ beta users",
      image: "/images/gear-fitness.png",
      stack: [
        "Spring Boot",
        "PostgreSQL",
        "React Native",
        "TypeScript",
        "Docker",
        "AWS",
      ],
      liveDemo: "https://gearfitness.app",
      repository: "https://github.com/gear-fitness/gear-fitness-app",
      note: "Spring Boot, PostgreSQL, React Native, TypeScript, Docker, AWS",
    },
    {
      name: "White Pass Ski Area",
      summary: "Scheduling tool for 200+ patrollers",
      image: "/images/white-pass-ski-area.png",
      stack: ["React", "TypeScript", "Firebase", "REST APIs", "CI/CD"],
      linkedin:
        "https://www.linkedin.com/posts/kbcrtz_over-the-summer-i-had-the-opportunity-to-activity-7381021453233639424-kb72",
      note: "React, TypeScript, Firebase",
    },
    {
      name: "Resume Optimizer Extension",
      summary: "Optimizes resumes with agentic orchestration",
      repository: "https://github.com/kbcrtz/resume-optimizer-extension",
      stack: ["TypeScript", "JavaScript", "Chrome APIs", "REST APIs"],
      note: "JavaScript, Claude, REST API",
    },
  ],
  contactLinks: [
    { label: "Email", href: "mailto:kobecortez31@gmail.com" },
    { label: "GitHub", href: "https://github.com/kbcrtz", external: true },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/kbcrtz",
      external: true,
    },
  ],
};
