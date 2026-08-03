import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Kept short on purpose: this is a brand moment, not a real loading state
// (the site has nothing meaningful to wait for). A visitor can also click
// or press any key to skip straight to the content.
const DURATION_MS = 1100;
const EXIT_MS = 500;

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setExiting(true);
    setTimeout(onDone, EXIT_MS);
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      finish();
      return;
    }

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      // ease-out curve so the counter feels like it's "arriving", not linear
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };
    raf = requestAnimationFrame(tick);

    // Let an impatient visitor skip straight in.
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          role="status"
          aria-label={`Loading portfolio, ${progress}% complete`}
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: EXIT_MS / 1000, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
        >
          <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />

          <div className="relative flex flex-col items-center gap-8">
            <div
              className="relative flex h-20 w-20 items-center justify-center"
              aria-hidden="true"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full border border-signal/30"
                  style={{ width: `${40 + i * 26}px`, height: `${40 + i * 26}px` }}
                  animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }}
                />
              ))}
              <span className="relative h-2.5 w-2.5 rounded-full bg-signal-soft shadow-glow" />
            </div>

            <div
              className="flex items-baseline gap-3 font-mono text-sm text-ink-dim"
              aria-hidden="true"
            >
          <span className="text-ink-muted">
  REHAN AHMAD • AI ENGINEER • INITIALIZING...
</span>
<span className="w-10 text-signal-soft tabular-nums">
  {progress}%
</span>
            </div>

            <div
              className="h-px w-40 overflow-hidden bg-edge-soft"
              aria-hidden="true"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-signal via-signal-soft to-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="font-mono text-[10px] tracking-wider text-ink-dim/70" aria-hidden="true">
              click or press any key to skip
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
