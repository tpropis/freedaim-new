import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initSmoothScroll, scrollToId, scrollToTop, ScrollTrigger } from "@/lib/motion";

// Starts Lenis once and keeps it in step with the router: new pages open at
// the top, and "/#section" links land on their section — even when arriving
// from another page.
export default function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    initSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    let tries = 0;
    let timer: number | undefined;
    const land = () => {
      if (hash) {
        // sections mount after the route renders; retry briefly until present
        if (!scrollToId(hash.slice(1)) && tries++ < 20) timer = window.setTimeout(land, 50);
      } else {
        scrollToTop(true);
      }
      ScrollTrigger.refresh();
    };
    land();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
