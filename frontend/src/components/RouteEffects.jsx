import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// On each page change: scroll to top (or to #hash) and move focus to the page
// heading so screen reader users hear the new page.
export default function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = window.setTimeout(() => {
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) { el.scrollIntoView(); el.focus?.({ preventScroll: true }); return; }
      }
      window.scrollTo(0, 0);
      const h = document.querySelector("[data-page-heading]") || document.getElementById("main");
      h?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);
  return null;
}
