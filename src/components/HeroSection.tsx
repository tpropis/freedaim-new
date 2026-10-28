// Hero — the founder's Declaration of Independence, printed as a broadside.
// One entrance: rules draw, the wood type presses in line by line, "Dream." is
// written in red ink, the wax seal stamps down, the signature signs itself.
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, fireIntro, reducedMotion } from "@/lib/motion";
import WaxSeal from "@/components/declaration/WaxSeal";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion) {
        fireIntro();
        return;
      }
      gsap.set(q(".h-fade"), { autoAlpha: 0, y: 14 });
      gsap.set(q(".h-rule"), { scaleX: 0 });
      gsap.set(q(".h-press"), { clipPath: "inset(0 0 100% 0)", y: 14 });
      gsap.set(q(".h-dream"), { clipPath: "inset(-10% 100% -10% 0)" });
      gsap.set(q(".h-sign"), { clipPath: "inset(-30% 100% -30% 0)" });
      gsap.set(q(".h-seal"), { autoAlpha: 0, scale: 2.1, rotate: -48 });

      let cancelled = false;
      document.fonts.ready.then(() => {
        if (cancelled) return;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onStart: fireIntro });
        tl.to(q(".h-kicker"), { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
          .to(q(".h-rule"), { scaleX: 1, duration: 0.7, ease: "power2.inOut", stagger: 0.05 }, 0.1)
          .to(q(".h-press"), { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.8, stagger: 0.13 }, 0.3)
          .to(q(".h-dream"), { clipPath: "inset(-10% 0% -10% 0)", duration: 1.05, ease: "power2.inOut" }, 0.72)
          .to(q(".h-body"), { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.1)
          .to(q(".h-seal"), { autoAlpha: 1, scale: 1, rotate: -12, duration: 0.5, ease: "back.out(2.4)" }, 1.35)
          // the stamp's impact nudges the sheet
          .fromTo(q(".h-sheet"), { y: 0 }, { y: 2, duration: 0.06, yoyo: true, repeat: 1, ease: "none" }, 1.62)
          .to(q(".h-sign"), { clipPath: "inset(-30% 0% -30% 0)", duration: 1.3, ease: "power1.inOut" }, 1.55)
          .to(q(".h-cta"), { autoAlpha: 1, y: 0, duration: 0.7 }, 1.7);
      });

      // On scroll the broadside eases back and the seal turns a little.
      gsap.to(q(".h-sheet"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".h-seal-wrap"), {
        rotate: 24,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-16 pt-28 md:min-h-[100svh] md:pb-0 md:pt-[104px]">
      {/* printer’s crop marks (bottom only — the nav owns the top) + a faint centre fold */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute bottom-6 left-6 h-6 w-6 border-b border-l border-ink/35" />
        <span className="absolute bottom-6 right-6 h-6 w-6 border-b border-r border-ink/35" />
        <span className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
      </div>

      <div className="h-sheet relative mx-auto max-w-[1180px] px-5 text-center md:px-10">
        <p className="h-fade h-kicker smallcaps text-ink-muted">
          A Declaration of Independence <span className="text-ink-red">★</span> for Founders
        </p>
        <div className="mx-auto mt-5 flex max-w-[760px] items-center gap-5 text-[13px] text-ink-red">
          <span className="h-rule double-rule flex-1 origin-right" />
          <span aria-hidden="true">★ &nbsp;★ &nbsp;★</span>
          <span className="h-rule double-rule flex-1 origin-left" />
        </div>

        <h1 className="mt-5 font-normal leading-[0.86]">
          <span className="h-press block font-wood text-[clamp(3.4rem,10vw,8.9rem)] tracking-[0.005em] text-ink">
            Stop Working on
          </span>
          <span className="h-press block font-wood text-[clamp(2.7rem,8.1vw,7.3rem)] tracking-[0.02em] text-ink">
            Someone Else’s
          </span>
          <span className="h-dream -mt-1 block font-display text-[clamp(4rem,11vw,9.8rem)] italic leading-[0.95] tracking-[-0.02em] text-ink-red">
            Dream.
          </span>
        </h1>

        <div className="mx-auto mt-7 grid max-w-[860px] gap-6 text-left font-caslon text-[17px] leading-[1.6] text-ink md:grid-cols-2 md:gap-14">
          <p className="h-fade h-body">
            <span className="float-left mr-2 mt-1 font-display text-[3.6rem] leading-[0.8] text-ink-red">W</span>
            hen in the course of a career it becomes necessary to stop building somebody else’s company, freedaim helps
            founders, entrepreneurs, and ambitious operators turn raw ideas into real businesses.
          </p>
          <p className="h-fade h-body">
            We hold this truth to be self-evident: an idea is worth nothing until it ships — through strategy, branding,
            AI systems, automation, and execution.
          </p>
        </div>
      </div>

      {/* signature + actions */}
      <div className="relative mx-auto mt-14 flex max-w-[1240px] flex-col gap-10 px-5 md:mt-10 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="max-w-[400px]">
          <div className="h-sign -rotate-3 pl-3 font-sig text-[clamp(3rem,5vw,4.2rem)] leading-[0.8] text-ink-blue">Your Name Here</div>
          <div className="mt-1 whitespace-nowrap border-t border-ink pt-2 font-caslon text-[11px] uppercase tracking-[0.26em] text-ink-muted">
            Signed — the founder, done waiting
          </div>
        </div>
        <div className="h-fade h-cta flex flex-wrap items-center gap-7">
          <Link to="/what-we-build" className="ink-link text-lg">
            See What We Can Build
          </Link>
          <Link to="/#cta" className="btn-press">
            Build My Idea <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="h-seal-wrap pointer-events-none absolute right-[6%] top-[58%] hidden lg:block">
        <WaxSeal size={140} className="h-seal" />
      </div>
    </section>
  );
}
