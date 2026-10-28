import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One easing family for the whole site.
export const EASE = "expo.out";

// One Lenis instance drives the page; GSAP's ticker drives Lenis so smooth
// scroll and ScrollTrigger stay on the same frame.
let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (reducedMotion || lenis || typeof window === "undefined") return lenis;
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

const NAV_OFFSET = -72;

export function scrollToId(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.6, immediate });
  else {
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top, behavior: immediate || reducedMotion ? "auto" : "smooth" });
  }
  return true;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

// The homepage intro (preloader → hero) is signalled with a window event so
// sections can wait for it without a shared store.
const INTRO_EVENT = "freedaim:intro";
declare global {
  interface Window {
    __freedaimIntroDone?: boolean;
  }
}
export function onIntro(cb: () => void) {
  if (window.__freedaimIntroDone) {
    cb();
    return () => {};
  }
  window.addEventListener(INTRO_EVENT, cb, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, cb);
}
export function fireIntro() {
  window.__freedaimIntroDone = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

export { gsap, ScrollTrigger, SplitText };
