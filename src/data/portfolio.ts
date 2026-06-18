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
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Leadership", href: "#leadership" },
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
  globeLocations: [
    {
      id: "puyallup",
      title: "Puyallup, WA",
      subtitle: "Hometown",
      lat: 47.1854,
      lng: -122.2929,
      accentColor: "#ef4444",
      story:
        "Where it started. I grew up in the Puyallup valley — the fair, the foothills, and the first clumsy lines of code I wrote on a hand-me-down laptop.",
    },
    {
      id: "plu",
      title: "Pacific Lutheran University",
      subtitle: "Where I study",
      lat: 47.1455,
      lng: -122.4434,
      accentColor: "#ef4444",
      story:
        "Pacific Lutheran University, where I study Computer Science, founded the CS Club and LuteHacks, and turned a hobby into a craft.",
      isDefault: true,
    },
    {
      id: "seattle",
      title: "Seattle, WA",
      subtitle: "Where I build",
      lat: 47.6062,
      lng: -122.3321,
      accentColor: "#ef4444",
      story:
        "Seattle — where I put it to work, shipping software at Proliance Surgeons and building in the Pacific Northwest tech scene.",
    },
  ],
  experience: [
    {
      org: "Proliance Surgeons",
      role: "Software Engineering & Applications Intern",
      period: "Jun 2026 – Present",
      location: "Seattle, WA",
      bullets: [
        "Built Python automation scripts integrating with third-party healthcare APIs to streamline data ingestion across internal and patient-facing systems.",
        "Queried and transformed data across SQL databases to support cross-system integration workflows and improve downstream data reliability.",
        "Prototyped AI-powered workflow automations with Claude to reduce repetitive manual processing in operational pipelines.",
      ],
    },
    {
      org: "White Pass Ski Area",
      role: "Software Engineer Intern",
      period: "May 2025 – Aug 2025",
      location: "Lewis County, WA",
      bullets: [
        "Designed and built an employee management system in React and TypeScript for 200+ patrollers, owning the UI end-to-end and reducing shift assignment time by 60%.",
        "Partnered with dispatchers to prototype responsive UI/UX workflows in Figma, then implemented reusable React components and interaction patterns from those designs.",
        "Integrated real-time data synchronization with Firebase, enabling instant updates across 200+ concurrent users and reducing data inconsistency errors by 85%.",
      ],
    },
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
    },
    {
      name: "Resume Optimizer Extension",
      summary: "Optimizes resumes with agentic orchestration",
      repository: "https://github.com/kbcrtz/resume-optimizer-extension",
      stack: ["TypeScript", "JavaScript", "Chrome APIs", "REST APIs"],
    },
    {
      name: "Machampions",
      summary: "Pokemon Champions battle assistant",
      image: "/images/machampions.png",
      stack: ["Next.js", "Tailwind CSS", "TypeScript", "Python", "Vercel"],
      liveDemo: "https://machampions.app",
      repository: "https://github.com/Machampions/Machampions",
    },
  ],
  leadership: [
    {
      org: "Pacific Lutheran University",
      role: "President, Computer Science Club",
      period: "Aug 2024 – Present",
      location: "Tacoma, WA",
      bullets: [
        "Founded and organized LuteHacks, PLU's first hackathon, leading logistics, judging, and sponsorship for a multi-track event focused on web and AI projects.",
        "Lead a 50+ member technical community by running workshops on React, AI/ML integration, and mock technical interviews.",
      ],
    },
    {
      org: "Technology Access Foundation",
      role: "Instructor, Web Development",
      period: "Jan 2025 – May 2025",
      location: "Federal Way, WA",
      bullets: [
        "Taught HTML, CSS, and JavaScript to 26 students, guiding front-end projects through iterative design and code reviews.",
      ],
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
