import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  id: string;
  title: string;
  subtitle?: string;
  className?: string;
}>;

const Section = ({ id, title, className, children }: SectionProps) => {
  return (
    <section id={id} className={`scroll-mt-20 py-8 md:scroll-mt-24 md:py-14 ${className ?? ""}`}>
      <header className="mb-4 text-center md:mb-7">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
};

export default Section;
