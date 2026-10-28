import { type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";

// Print-shop scroll motion, driven by data attributes so markup stays readable:
//   data-ink="press" → wood type presses in from the top, like a platen
//   data-ink="wipe"  → ink rolls on left→right
//   data-ink="sign"  → a signature writes itself (slower wipe)
//   data-ink="stamp" → a stamp lands hard (optional data-rot for its final angle)
//   data-ink="fade"  → body copy settles in
// Each plays once when it reaches 85% of the viewport.
const MOTIONS: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  press: {
    from: { clipPath: "inset(0 0 100% 0)", y: 12 },
    to: { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 },
  },
  wipe: {
    from: { clipPath: "inset(0 100% 0 0)" },
    to: { clipPath: "inset(0 0% 0 0)", duration: 1.15, ease: "power2.inOut", stagger: 0.12 },
  },
  sign: {
    from: { clipPath: "inset(-20% 100% -20% 0)" },
    to: { clipPath: "inset(-20% 0% -20% 0)", duration: 1.6, ease: "power1.inOut", stagger: 0.25 },
  },
  stamp: {
    from: { autoAlpha: 0, scale: 1.9 },
    to: { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.2)", stagger: 0.12 },
  },
  fade: {
    from: { autoAlpha: 0, y: 18 },
    to: { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.08 },
  },
};

export function useInk(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root || reducedMotion) return;
      for (const [kind, { from, to }] of Object.entries(MOTIONS)) {
        const els = gsap.utils.toArray<HTMLElement>(`[data-ink="${kind}"]`, root);
        if (!els.length) continue;
        els.forEach((el) => {
          const rot = el.dataset.rot ? parseFloat(el.dataset.rot) : 0;
          gsap.set(el, { ...from, ...(kind === "stamp" ? { rotate: rot - 22 } : {}) });
        });
        ScrollTrigger.batch(els, {
          start: "top 85%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              ...to,
              ...(kind === "stamp" ? { rotate: (_: number, t: HTMLElement) => (t.dataset.rot ? parseFloat(t.dataset.rot) : 0) } : {}),
              overwrite: true,
            }),
        });
      }
    },
    { scope }
  );
}
