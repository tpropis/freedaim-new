import { Link } from "react-router-dom";
import { Lockup } from "@/components/brand/Logo";

const columns = [
  {
    title: "The Studio",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Who It’s For", href: "/#audience" },
      { label: "Why freedaim", href: "/#why" },
      { label: "Process", href: "/#process" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "What We Build", href: "/what-we-build" },
      { label: "Merch", href: "/merch" },
      { label: "Whiteboard", href: "/whiteboard" },
      { label: "Contact", href: "/#cta" },
    ],
  },
];

// `paper` renders the printer's-colophon footer of the Declaration pages;
// `dark` keeps the footer for pages not yet redesigned.
export default function Footer({ tone = "dark" }: { tone?: "paper" | "dark" }) {
  const paper = tone === "paper";

  return (
    <footer className="relative overflow-hidden border-t border-foreground/15 pt-20">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-5 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <Lockup height={30} light={paper} />
          <p className={`mt-5 max-w-xs text-foreground/65 ${paper ? "font-caslon text-lg italic" : ""}`}>Build what should exist.</p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <p className={paper ? "smallcaps mb-5 text-ink-muted" : "eyebrow mb-5"}>{c.title}</p>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className={`text-foreground/75 transition-colors hover:text-foreground ${paper ? "font-caslon text-[17px] hover:text-ink-red" : ""}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* oversized wordmark bleeding off the bottom edge */}
      <div className="mx-auto mt-20 max-w-[1240px] px-5 md:px-10" aria-hidden="true">
        <img
          src={paper ? "/brand/wordmark-light.svg" : "/brand/wordmark.svg"}
          alt=""
          className="w-full translate-y-[18%] opacity-[0.06]"
          draggable={false}
        />
      </div>

      <div className="relative border-t border-foreground/15 bg-background">
        <div
          className={`mx-auto flex max-w-[1240px] flex-col gap-2 px-5 py-6 text-foreground/50 sm:flex-row sm:justify-between md:px-10 ${
            paper ? "font-caslon text-[11px] uppercase tracking-[0.22em]" : "font-mono text-[11px] uppercase tracking-[0.16em]"
          }`}
        >
          <span>© {new Date().getFullYear()} freedaim. All rights reserved.</span>
          <span>{paper ? "Set in Caslon & Bebas · Printed in ink" : "Strategy · Branding · AI · Execution"}</span>
        </div>
      </div>
    </footer>
  );
}
