import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
}>;

const Section = ({ id, title, subtitle, className, children }: SectionProps) => {
  return (
    <section id={id} className={`scroll-mt-20 py-8 md:scroll-mt-24 md:py-14 ${className ?? ""}`}>
      <header className="mb-4 md:mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:mt-2 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
};

export default Section;
