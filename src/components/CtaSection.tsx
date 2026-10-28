import { useRef } from "react";
import { Link } from "react-router-dom";
import { useInk } from "@/components/declaration/useInk";
import WaxSeal from "@/components/declaration/WaxSeal";

export default function CtaSection() {
  const root = useRef<HTMLElement>(null);
  useInk(root);

  return (
    <section id="cta" ref={root} className="relative overflow-hidden bg-ink py-28 text-paper-light md:py-36">
      <div className="mx-auto max-w-[1180px] px-5 text-center md:px-10">
        <p data-ink="fade" className="smallcaps text-paper-light/55">
          In Witness Whereof <span className="text-[#E0515A]">★</span>
        </p>
        <h2 className="mt-6 leading-[0.88]">
          <span data-ink="press" className="block font-wood text-[clamp(3rem,8.4vw,7.6rem)] tracking-[0.01em]">
            You can keep waiting.
          </span>
          <span data-ink="wipe" className="block font-display text-[clamp(3rem,8vw,7.2rem)] italic text-[#E0515A]">
            Or you can build it.
          </span>
        </h2>
        <p data-ink="fade" className="mx-auto mt-8 max-w-[560px] font-caslon text-lg leading-[1.6] text-paper-light/70">
          If you’re serious about launching something real, freedaim helps you move from idea to execution.
        </p>

        <div data-ink="fade" className="mt-12 flex flex-col items-center justify-center gap-8 sm:flex-row">
          <Link
            to="/whiteboard"
            className="inline-flex items-center gap-3 bg-paper-light px-8 py-4 font-caslon text-[13px] font-bold uppercase tracking-[0.2em] text-ink shadow-[4px_4px_0_#B5242E] transition-[transform,box-shadow] duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#B5242E]"
          >
            Let’s Build It <span aria-hidden="true">→</span>
          </Link>
          <span className="font-caslon italic text-paper-light/55">— and sign the Declaration.</span>
        </div>
      </div>
      <div data-ink="stamp" data-rot="-14" className="pointer-events-none absolute -bottom-6 right-[7%] hidden md:block">
        <WaxSeal size={150} />
      </div>
    </section>
  );
}
