import type { ComponentType } from "react";

export type ContactLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  name: string;
  summary: string;
  stack: string[];
  image?: string;
  liveDemo?: string;
  linkedin?: string;
  repository?: string;
  note?: string;
};

export type StackItem = {
  name: string;
  icon: ComponentType<{ size?: number | string; className?: string }>;
  color: string;
};

export type PortfolioData = {
  name: string;
  title: string;
  location: string;
  oneLiner: string;
  about: string[];
  navLinks: { label: string; href: string }[];
  stack: StackItem[];
  projects: Project[];
  contactLinks: ContactLink[];
};
