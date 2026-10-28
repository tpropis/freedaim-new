import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reducedMotion } from "@/lib/motion";
import { useInk } from "@/components/declaration/useInk";

const grievances = [
  "Too many ideas, no structure.",
  "Too much hesitation, no execution.",
  "Too much manual work, no systems.",
];

// "The Grievances": the three reasons people stay stuck, each struck through in
// red ink as you scroll past it — then the resolution is stamped.
export default function WhySection() {
  const root = useRef<HTMLElement>(null);
  useInk(root);

  useGSAP(
    () => {
      const strikes = gsap.utils.toArray<HTMLElement>(".ink-strike", root.current);
      if (reducedMotion) {
        gsap.set(strikes, { "--strike": 1 });
        return;
      }
      strikes.forEach((el) => {
        gsap.fromTo(
          el,
          { "--strike": 0 },
          {
            "--strike": 1,
            ease: "none",
            scrollTrigger: { trigger: el.closest("li"), start: "top 70%", end: "top 40%", scrub: 0.5 },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="why" ref={root} className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        <p data-ink="fade" className="smallcaps text-ink-muted">
          The Grievances <span className="text-ink-red">·</span> Why freedaim
        </p>
        <h2 data-ink="wipe" className="mt-5 max-w-[880px] font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.04]">
          Most People Stay Stuck for the Same Reasons.
        </h2>

        <ol className="mt-14 space-y-6 md:mt-16">
          {grievances.map((g, i) => (
            <li key={g} className="flex items-baseline gap-5 md:gap-10">
              <span className="w-10 shrink-0 font-caslon text-sm text-ink-muted md:w-14">{["I.", "II.", "III."][i]}</span>
              <p className="font-wood text-[clamp(2.4rem,6.6vw,6rem)] leading-[1] tracking-[0.01em] text-ink">
                {/* inline so the red strike follows every wrapped line (see .ink-strike) */}
                <span className="ink-strike">{g}</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col gap-8 border-t border-ink/30 pt-10 md:mt-20 md:flex-row md:items-center md:justify-between">
          <p data-ink="fade" className="max-w-[760px] font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.2]">
            freedaim exists to close the gap between <em>ambition</em> and{" "}
            <em>action</em>.
          </p>
          <span
            data-ink="stamp"
            data-rot="-8"
            className="inline-block self-start border-[3px] border-ink-red px-5 py-2 font-wood text-4xl tracking-[0.12em] text-ink-red opacity-90 md:self-auto"
          >
            Resolved.
          </span>
        </div>
      </div>
    </section>
  );
}
