import { Download, Mail } from "lucide-react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Section from "../ui/Section";
import type { ContactLink } from "../../types/portfolio";

type ContactSectionProps = {
  links: ContactLink[];
};

const iconFor = (label: string) => {
  if (label === "GitHub") return <FaGithub size={22} />;
  if (label === "LinkedIn") return <FaLinkedinIn size={20} />;
  if (label === "Instagram") return <FaInstagram size={21} />;
  return <Mail size={20} />;
};

const ContactSection = ({ links }: ContactSectionProps) => {
  return (
    <Section id="contact" title="Contact">
      <ul className="flex items-center justify-center gap-4 sm:gap-5">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              aria-label={link.label}
              title={link.label}
              className="contactButtonGlow flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-200 transition hover:text-zinc-100 sm:h-14 sm:w-14"
            >
              {iconFor(link.label)}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex justify-center sm:mt-6">
        <a
          href="/resume.pdf"
          download
          className="contactButtonGlow inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:text-zinc-100"
        >
          <Download size={14} />
          Download Resume
        </a>
      </div>
    </Section>
  );
};

export default ContactSection;
