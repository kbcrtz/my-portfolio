import type { StackItem } from "../../types/portfolio";

type StackSectionProps = {
  stack: StackItem[];
};

const StackSection = ({ stack }: StackSectionProps) => {
  return (
    <div className="-mt-2 mb-6 md:-mt-4 md:mb-10">
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stack.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.name}
              className="stackTechCard flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center shadow-sm transition hover:-translate-y-0.5 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-none md:px-2.5 md:py-2"
              style={{ ["--tech-color" as any]: item.color }}
            >
              <Icon className="stackTechIcon" size={36} />
              <p className="mt-1.5 text-[11px] font-medium leading-tight text-zinc-800 dark:text-zinc-100 md:text-[12px]">
                {item.name}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default StackSection;
