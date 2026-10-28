import { useRef } from "react";
import { useInk } from "@/components/declaration/useInk";

// Who it's for, as the signatories of the declaration. Each signs on as the
// section scrolls in.
const signatories = [
  { text: "Entrepreneurs with real ideas but no execution plan", sig: "The Entrepreneur" },
  { text: "Small businesses ready to modernize and automate", sig: "The Small Business" },
  { text: "Founders launching a new service, brand, or SaaS concept", sig: "The Founder" },
  { text: "Operators who are tired of being stuck in someone else's system", sig: "The Operator" },
];

export default function AudienceSection() {
  const root = useRef<HTMLElement>(null);
  useInk(root);

  return (
    <section id="audience" ref={root} className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p data-ink="fade" className="smallcaps text-ink-muted">
              The Signatories <span className="text-ink-red">·</span> Who It’s For
            </p>
            <h2 data-ink="press" className="mt-5 font-wood text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.9] tracking-[0.01em]">
              Built for People Ready to Move.
            </h2>
          </div>
          <p data-ink="fade" className="max-w-[300px] font-caslon italic text-ink-muted md:text-right">
            In witness whereof, the undersigned are done waiting.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {signatories.map((s, i) => (
            <div key={s.sig} className="flex flex-col justify-between gap-10">
              <p data-ink="fade" className="font-caslon text-[19px] leading-[1.5] text-ink">
                {s.text}
              </p>
              <div>
                <div data-ink="sign" className="-rotate-3 pl-2 font-sig text-[2.7rem] leading-[0.85] text-ink-blue">
                  {s.sig}
                </div>
                <div className="mt-1 border-t border-ink pt-2 font-caslon text-[11px] uppercase tracking-[0.26em] text-ink-muted">
                  Signatory {["I", "II", "III", "IV"][i]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
