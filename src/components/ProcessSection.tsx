import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";
import { useInk } from "@/components/declaration/useInk";

const stages = [
  { n: "I", title: "Clarify", desc: "We refine the idea, the offer, and the opportunity.", at: 0.1 },
  { n: "II", title: "Build", desc: "We create the brand, website, systems, and assets.", at: 0.38 },
  { n: "III", title: "Automate", desc: "We use AI and smart workflows to remove friction.", at: 0.66 },
  { n: "IV", title: "Launch", desc: "We help turn momentum into something real and usable.", at: 0.96 },
];

// The flight path, plotted in ink on engineering paper. The trajectory draws
// with scroll, the star rides its tip, and each stage is stamped as it's reached.
const PATH = "M90 488 C 320 486, 520 432, 690 306 S 990 96, 1140 74";

export default function ProcessSection() {
  const root = useRef<HTMLElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  useInk(root);

  useGSAP(
    () => {
      const svg = chart.current!.querySelector("svg")!;
      const path = svg.querySelector<SVGPathElement>(".flight")!;
      const star = svg.querySelector<SVGGElement>(".flight-star")!;
      const stamps = gsap.utils.toArray<SVGGElement>(".stage-stamp", svg);
      const legend = gsap.utils.toArray<HTMLElement>(".stage-legend", root.current);
      const L = path.getTotalLength();

      // place the stamps on the curve
      stamps.forEach((g, i) => {
        const p = path.getPointAtLength(L * stages[i].at);
        g.setAttribute("transform", `translate(${p.x} ${p.y})`);
      });

      const render = (prog: number) => {
        path.style.strokeDashoffset = String(1 - prog);
        const p = path.getPointAtLength(L * Math.max(prog, 0.001));
        star.setAttribute("transform", `translate(${p.x} ${p.y})`);
        stages.forEach((s, i) => {
          const on = prog >= s.at - 0.005;
          stamps[i].classList.toggle("is-on", on);
          legend[i].classList.toggle("is-on", on);
        });
      };

      if (reducedMotion) {
        render(1);
        return;
      }
      render(0);
      const mm = gsap.matchMedia();
      // desktop: hold the chart in place while the path plots
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: chart.current,
          start: "center 55%",
          end: "+=900",
          pin: root.current,
          pinSpacing: true,
          scrub: 0.6,
          onUpdate: (self) => render(self.progress),
        });
      });
      // small screens: plot as it passes, no pinning
      mm.add("(max-width: 1023px)", () => {
        ScrollTrigger.create({
          trigger: chart.current,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.6,
          onUpdate: (self) => render(self.progress),
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="process" ref={root} className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-ink="fade" className="smallcaps text-ink-muted">
              The Flight Plan <span className="text-ink-red">·</span> Process
            </p>
            <h2 data-ink="press" className="mt-5 font-wood text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.9] tracking-[0.01em]">
              From Idea to Reality.
            </h2>
          </div>
          <p data-ink="fade" className="font-type text-sm uppercase tracking-[0.12em] text-ink-muted">
            Mission FDM-001 &nbsp;·&nbsp; Vehicle: your idea
          </p>
        </div>

        <div ref={chart} className="relative mt-12 border border-ink bg-paper-light shadow-[6px_6px_0_rgba(23,20,15,0.1)]">
          <svg viewBox="0 0 1200 560" className="block h-auto w-full" role="img" aria-label="Flight path from idea to reality through four stages: Clarify, Build, Automate, Launch">
            <defs>
              <pattern id="fd-grid-minor" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#1E3663" strokeOpacity=".08" strokeWidth="1" />
              </pattern>
              <pattern id="fd-grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#fd-grid-minor)" />
                <path d="M100 0H0V100" fill="none" stroke="#1E3663" strokeOpacity=".18" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1200" height="560" fill="url(#fd-grid-major)" />

            {/* axes + ticks */}
            <g stroke="#17140F" strokeWidth="1.5">
              <line x1="80" y1="500" x2="1160" y2="500" />
              <line x1="80" y1="500" x2="80" y2="40" />
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`x${i}`} x1={80 + i * 108} y1="500" x2={80 + i * 108} y2={i % 2 ? 506 : 512} />
              ))}
              {Array.from({ length: 5 }, (_, i) => (
                <line key={`y${i}`} x1="74" y1={500 - i * 115} x2="80" y2={500 - i * 115} />
              ))}
            </g>
            <g fontFamily='"Courier Prime", monospace' fontSize="13" fill="#3E382E" letterSpacing="1.5">
              <text x="90" y="530">T+0 · IDEA</text>
              <text x="1160" y="530" textAnchor="end">REALITY</text>
              <text x="0" y="0" transform="translate(54 300) rotate(-90)" textAnchor="middle">
                ALTITUDE ↑
              </text>
              <text x="1160" y="34" textAnchor="end">PLOTTED IN INK — FREEDAIM</text>
            </g>

            {/* the planned course, then the flown path drawn over it */}
            <path d={PATH} fill="none" stroke="#17140F" strokeOpacity=".28" strokeWidth="1.5" strokeDasharray="4 7" />
            <path
              className="flight"
              d={PATH}
              fill="none"
              stroke="#B5242E"
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              style={{ strokeDashoffset: 1 }}
            />

            {stages.map((s) => (
              <g key={s.n} className="stage-stamp">
                <circle r="21" fill="#F6F0E3" stroke="#17140F" strokeWidth="1.5" />
                <circle className="stamp-fill" r="21" fill="#B5242E" />
                <text y="5" textAnchor="middle" fontFamily='"Libre Caslon Text", serif' fontWeight="700" fontSize="14" className="stamp-num">
                  {s.n}
                </text>
              </g>
            ))}

            {/* the vehicle: freedaim's star */}
            <g className="flight-star">
              {/* star points average to (80,42) in the logo grid; centre it on the tip */}
              <path
                transform="scale(.5) translate(-80 -42)"
                d="M85.56,10.49L89.35,32.97L111.69,37.55L91.48,48.1L94.03,70.76L77.74,54.8L56.98,64.23L67.13,43.81L51.75,26.98L74.3,30.32Z"
                fill="#B5242E"
                stroke="#17140F"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s) => (
            <li key={s.n} className="stage-legend border-t-2 border-ink/20 pt-4 transition-[border-color,opacity] duration-500">
              <span className="font-type text-xs uppercase tracking-[0.16em] text-ink-muted">Stage {s.n}</span>
              <h3 className="mt-2 font-display text-3xl">{s.title}</h3>
              <p className="mt-2 font-caslon text-[16px] leading-[1.55] text-ink-soft">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
