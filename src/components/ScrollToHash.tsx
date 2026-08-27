import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!hash) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      const prefersReducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      )?.matches;
      const element = document.getElementById(hash.slice(1));

      element?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [hash, pathname]);

  return null;
}
