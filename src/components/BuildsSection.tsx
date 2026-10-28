import { useRef } from "react";
import { Link } from "react-router-dom";
import { useInk } from "@/components/declaration/useInk";
import Exhibit from "@/components/declaration/Exhibit";
import websiteImg from "@/assets/builds/web/website.webp";
import saasImg from "@/assets/builds/web/saas.webp";
import automationImg from "@/assets/builds/web/automation.webp";
import mobileImg from "@/assets/builds/web/mobile.webp";

const capabilities = [
  "AI-powered service business systems",
  "Premium local service brands",
  "Founder websites & personal brands",
  "SaaS MVP launch pages",
  "Automation workflows",
  "Sales enablement systems",
  "Pitch decks & investor materials",
  "Internal tools & dashboards",
];

// Real builds from /what-we-build, each shown as sketch → reality.
const exhibits = [
  {
    kind: "website" as const,
    image: websiteImg,
    title: "Premium Website Build",
    caption: "Polished launch-ready websites that make new ideas feel credible from day one.",
  },
  {
    kind: "saas" as const,
    image: saasImg,
    title: "CRM / SaaS Dashboard",
    caption: "Sales dashboards, customer pipelines, analytics, lead management, and real-time reporting.",
  },
  {
    kind: "automation" as const,
    image: automationImg,
    title: "Automation & AI Calling System",
    caption: "Website form → CRM capture → AI call → SMS follow-up → booked appointment.",
  },
  {
    kind: "mobile" as const,
    image: mobileImg,
    title: "Mobile App Concept",
    caption: "iPhone-style product experiences built for real users, workflows, and launches.",
  },
];

export default function BuildsSection() {
  const root = useRef<HTMLElement>(null);
  useInk(root);

  return (
    <section id="builds" ref={root} className="relative py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p data-ink="fade" className="smallcaps text-ink-muted">
              The Exhibits <span className="text-ink-red">·</span> Capabilities
            </p>
            <h2 data-ink="press" className="mt-5 font-wood text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.9] tracking-[0.01em]">
              What We Can Help Build
            </h2>
            <p data-ink="fade" className="mt-6 max-w-[440px] font-caslon text-[17px] italic leading-[1.6] text-ink-soft">
              Every build starts as a sketch on a whiteboard. Scroll the exhibits — or drag them — to watch the idea become the real thing.
            </p>
          </div>

          {/* the eight capabilities, set like a document's index */}
          <ol className="self-end">
            {capabilities.map((c, i) => (
              <li key={c} data-ink="fade" className="flex items-baseline gap-3 border-b border-ink/20 py-3 font-caslon text-[17px]">
                <span className="w-8 shrink-0 text-sm text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>{c}</span>
                <span className="mb-[5px] flex-1 border-b border-dotted border-ink/35" aria-hidden="true" />
                <span className="text-ink-red" aria-hidden="true">★</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {exhibits.map((e, i) => (
            <Exhibit key={e.kind} {...e} label={`Exhibit ${String.fromCharCode(65 + i)}`} seed={11 + i * 7} />
          ))}
        </div>

        <div data-ink="fade" className="mt-16 flex justify-center">
          <Link to="/what-we-build" className="btn-outline-ink">
            See every build <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
