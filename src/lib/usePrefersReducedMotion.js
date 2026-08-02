import { useEffect, useState } from "react";

/**
 * Tracks the `prefers-reduced-motion` media query so components can skip
 * decorative animation (WebGL scenes, parallax, infinite loops) for users
 * who've asked the OS to reduce motion.
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
