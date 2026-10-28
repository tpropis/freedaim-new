import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { Lockup } from "@/components/brand/Logo";
import { CartDrawer } from "@/components/CartDrawer";
import { gsap, getLenis, onIntro, reducedMotion, EASE } from "@/lib/motion";

// "/#id" links land on homepage sections from any page (see SmoothScroll).
const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "What We Build", href: "/what-we-build" },
  { label: "Why freedaim", href: "/#why" },
  { label: "Process", href: "/#process" },
  { label: "Merch", href: "/merch" },
  { label: "Whiteboard", href: "/whiteboard" },
];

type Props = {
  /** Puts the Shopify cart in the bar (merch + product pages). */
  showCart?: boolean;
  /** "paper" for the Declaration pages, "dark" for pages not yet redesigned. */
  tone?: "paper" | "dark";
};

export default function Navbar({ showCart = false, tone = "dark" }: Props) {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const paper = tone === "paper";

  // Entrance with the hero on the homepage, hide-on-scroll-down, solid when scrolled.
  useEffect(() => {
    const el = bar.current!;
    let off = () => {};
    if (!reducedMotion && pathname === "/") {
      gsap.set(el, { autoAlpha: 0 });
      off = onIntro(() => gsap.to(el, { autoAlpha: 1, duration: 0.8, ease: "power2.out", delay: 0.9 }));
    }

    let hidden = false;
    let last = 0;
    const onScroll = (y: number) => {
      el.classList.toggle("nav-solid", y > 24);
      const down = y > last && y > 200;
      if (down !== hidden) {
        hidden = down;
        gsap.to(el, { yPercent: down ? -100 : 0, duration: 0.6, ease: EASE });
      }
      last = y;
    };
    const lenis = getLenis();
    const handler = lenis ? (l: { scroll: number }) => onScroll(l.scroll) : () => onScroll(window.scrollY);
    if (lenis) lenis.on("scroll", handler);
    else window.addEventListener("scroll", handler as () => void, { passive: true });
    onScroll(window.scrollY);
    return () => {
      off();
      if (lenis) lenis.off("scroll", handler);
      else window.removeEventListener("scroll", handler as () => void);
    };
  }, [pathname]);

  // Mobile menu: curtain + staggered links; lock scroll while open.
  useGSAP(
    () => {
      const m = menu.current!;
      const lenis = getLenis();
      if (open) {
        lenis?.stop();
        gsap.set(m, { display: "flex" });
        gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
        gsap.fromTo(".m-link", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.05, delay: 0.25 });
      } else {
        lenis?.start();
        gsap.to(m, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.55,
          ease: "expo.inOut",
          onComplete: () => gsap.set(m, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: menu }
  );

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <>
      <nav ref={bar} className="nav fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link to="/" aria-label="freedaim — home" className="relative z-10">
            <Lockup height={28} light={paper} />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} className="nav-link" aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {showCart && <CartDrawer />}
            {paper ? (
              <Link to="/whiteboard" className="btn-outline-ink hidden !py-[11px] sm:inline-flex">
                Sign the Declaration
              </Link>
            ) : (
              <Link
                to="/#cta"
                className="hidden h-10 items-center rounded-full bg-off-white px-5 text-[13px] font-medium text-background transition-colors hover:bg-white sm:inline-flex"
              >
                Let’s Build
              </Link>
            )}
            <button
              onClick={() => setOpen((o) => !o)}
              className={`relative z-10 flex h-10 w-10 items-center justify-center border border-foreground/25 lg:hidden ${paper ? "" : "rounded-full"}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`absolute h-px w-4 bg-foreground transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
              <span className={`absolute h-px w-4 bg-foreground transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[3px]"}`} />
            </button>
          </div>
        </div>
      </nav>

      <div
        ref={menu}
        className="fixed inset-0 z-40 hidden flex-col justify-between bg-background px-5 pb-10 pt-28 lg:hidden"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <Link to={l.href} onClick={() => setOpen(false)} className="m-link flex items-baseline gap-4 py-1.5">
                <span className={`text-[11px] text-foreground/40 ${paper ? "font-caslon" : "font-mono"}`}>
                  {paper ? ["I", "II", "III", "IV", "V", "VI"][i] : String(i + 1).padStart(2, "0")}
                </span>
                <span className={paper ? "font-wood text-5xl tracking-[0.01em] text-foreground" : "text-4xl font-semibold tracking-[-0.03em] text-foreground"}>
                  {l.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to={paper ? "/whiteboard" : "/#cta"}
          onClick={() => setOpen(false)}
          className={paper ? "btn-press justify-center" : "inline-flex h-14 items-center justify-center rounded-full bg-crimson text-base font-medium text-white"}
        >
          {paper ? "Sign the Declaration" : "Let’s Build"}
        </Link>
      </div>
    </>
  );
}
