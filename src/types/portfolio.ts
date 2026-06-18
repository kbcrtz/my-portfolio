import type { ComponentType } from "react";

export type ContactLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
};

export type Project = {
  name: string;
  summary: string;
  stack: string[];
  bullets?: string[];
  image?: string;
  liveDemo?: string;
  linkedin?: string;
  repository?: string;
};

export type StackItem = {
  name: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  color: string;
};

export type GlobeLocation = {
  id: string;
  title: string;
  subtitle?: string;
  lat: number;
  lng: number;
  accentColor: string;
  story: string;
  isDefault?: boolean;
};

export type PortfolioData = {
  name: string;
  title: string;
  location: string;
  oneLiner: string;
  about: string[];
  navLinks: { label: string; href: string }[];
  stack: StackItem[];
  globeLocations: GlobeLocation[];
  experience: ExperienceItem[];
  projects: Project[];
  leadership: ExperienceItem[];
  contactLinks: ContactLink[];
};
