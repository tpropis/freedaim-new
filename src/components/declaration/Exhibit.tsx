import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";
import { drawSketch, type SketchKind } from "./sketches";

// One exhibit: an ink sketch laid over the finished build. Scrolling moves the
// divider so the sketch turns into the real thing; the handle can also be
// dragged (or moved with arrow keys) to compare by hand.
export default function Exhibit({
  kind,
  image,
  label,
  title,
  caption,
  seed,
}: {
  kind: SketchKind;
  image: string;
  label: string;
  title: string;
  caption: string;
  seed: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const sketch = useRef<SVGSVGElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const manual = useRef(false);

  const setReveal = (v: number) => {
    const p = Math.min(1, Math.max(0, v));
    frame.current?.style.setProperty("--reveal", String(p));
    handle.current?.setAttribute("aria-valuenow", String(Math.round(p * 100)));
  };

  useEffect(() => {
    if (!sketch.current) return;
    let cancelled = false;
    // annotations use Caveat; draw once the font is ready so they render in it
    document.fonts.ready.then(() => !cancelled && drawSketch(sketch.current!, kind, seed));
    return () => {
      cancelled = true;
    };
  }, [kind, seed]);

  useGSAP(
    () => {
      setReveal(reducedMotion ? 0.5 : 0.06);
      if (reducedMotion) return;
      ScrollTrigger.create({
        trigger: frame.current,
        start: "top 78%",
        end: "bottom 30%",
        scrub: 0.6,
        onUpdate: (self) => {
          if (!manual.current) setReveal(0.06 + self.progress * 0.94);
        },
      });
    },
    { scope: frame }
  );

  const dragTo = (clientX: number) => {
    const r = frame.current!.getBoundingClientRect();
    setReveal((clientX - r.left) / r.width);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    manual.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons) dragTo(e.clientX);
  };
  const onKey = (e: React.KeyboardEvent) => {
    const cur = parseFloat(frame.current!.style.getPropertyValue("--reveal") || "0");
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      manual.current = true;
      setReveal(cur + (e.key === "ArrowRight" ? 0.05 : -0.05));
    }
  };

  return (
    <figure>
      <div
        ref={frame}
        className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden border border-ink bg-ink shadow-[6px_6px_0_rgba(23,20,15,0.12)]"
        style={{ ["--reveal" as string]: 0.06 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <div
          className="absolute inset-0 bg-paper-light"
          style={{
            clipPath: "inset(0 0 0 calc(var(--reveal) * 100%))",
            backgroundImage: "radial-gradient(rgba(30,54,99,0.13) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        >
          <svg ref={sketch} viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true" />
        </div>
        <div className="absolute inset-y-0 w-[2px] bg-ink" style={{ left: "calc(var(--reveal) * 100%)" }}>
          <button
            ref={handle}
            type="button"
            role="slider"
            aria-label={`Compare the sketch and the finished ${title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={6}
            onKeyDown={onKey}
            // slides along the divider so it never runs off the frame at either edge
            style={{ transform: "translate(calc(-50% - (var(--reveal) - 0.5) * 90%), -50%)" }}
            className="absolute left-0 top-1/2 flex cursor-ew-resize items-center gap-2 whitespace-nowrap bg-ink px-3 py-2 font-caslon text-[10px] font-bold uppercase tracking-[0.2em] text-paper-light shadow-[3px_3px_0_#B5242E] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink-red"
          >
            ◀ Real <span className="opacity-50">|</span> Sketch ▶
          </button>
        </div>
      </div>
      <figcaption className="mt-5 flex flex-col gap-1">
        <span className="smallcaps text-ink">{label}</span>
        <span className="font-display text-2xl leading-tight">{title}</span>
        <span className="max-w-[460px] font-caslon text-[15px] leading-[1.55] text-ink-soft">{caption}</span>
      </figcaption>
    </figure>
  );
}
