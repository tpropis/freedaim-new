import { useRef } from "react";
import { useInk } from "@/components/declaration/useInk";

// The four services, set as the Articles of the declaration.
const articles = [
  {
    n: "I",
    title: "Business Launch Strategy",
    desc: "Turn scattered ideas into clear business concepts, offers, positioning, and launch plans.",
  },
  {
    n: "II",
    title: "Branding & Websites",
    desc: "Build premium brands, websites, landing pages, and digital presence that actually look credible.",
  },
  {
    n: "III",
    title: "AI & Automation",
    desc: "Create systems that eliminate repetitive work, improve operations, and help businesses move faster.",
  },
  {
    n: "IV",
    title: "Sales & Growth Tools",
    desc: "Pitch decks, lead systems, CRM workflows, outbound strategy, and tools that help businesses win.",
  },
];

export default function ServicesSection() {
  const root = useRef<HTMLElement>(null);
  useInk(root);

  return (
    <section id="services" ref={root} className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <div className="text-center">
          <p data-ink="fade" className="smallcaps text-ink-muted">
            The Articles <span className="text-ink-red">·</span> What We Do
          </p>
          <h2 className="mt-5 font-wood leading-[0.9] tracking-[0.01em]">
            <span data-ink="press" className="block text-[clamp(1.9rem,4.4vw,3.8rem)] text-ink-muted">
              Ideas Don’t Need More Thinking.
            </span>
            <span data-ink="press" className="mt-2 inline-block border-b-[6px] border-ink pb-2 text-[clamp(3rem,7.6vw,6.6rem)]">
              They Need Execution.
            </span>
          </h2>
        </div>

        <div className="double-rule mx-auto mt-14 max-w-[1000px]" />
        <div className="mx-auto grid max-w-[1000px] md:grid-cols-2">
          {articles.map((a, i) => (
            <article
              key={a.n}
              className={`relative border-b border-ink/25 py-10 md:px-10 ${i % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"}`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  data-ink="stamp"
                  data-rot={i % 2 ? "4" : "-5"}
                  className="inline-block min-w-[3.2rem] border-[1.5px] border-ink-red px-2 py-1 text-center font-caslon text-sm font-bold tracking-[0.12em] text-ink-red"
                >
                  {a.n}
                </span>
                <span className="smallcaps text-ink-muted">Article the {["First", "Second", "Third", "Fourth"][i]}</span>
              </div>
              <h3 data-ink="wipe" className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05]">
                {a.title}
              </h3>
              <p data-ink="fade" className="mt-4 max-w-[420px] font-caslon text-[17px] leading-[1.6] text-ink-soft">
                {a.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
