import { ExternalLink, Mail } from "lucide-react";
import Section from "../ui/Section";
import type { ContactLink } from "../../types/portfolio";

type ContactSectionProps = {
  links: ContactLink[];
};

const ContactSection = ({ links }: ContactSectionProps) => {
  return (
    <Section
      id="contact"
      title="Contact"
      subtitle="Reach out directly by email or profile links."
    >
      <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="contactButtonGlow flex h-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-100 sm:px-4 sm:py-3"
            >
              <span className="inline-flex items-center gap-2">
                {link.label === "Email" ? <Mail size={14} /> : <ExternalLink size={14} />}
                {link.label}
              </span>
              <span className="text-xs text-zinc-400">Open</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default ContactSection;
