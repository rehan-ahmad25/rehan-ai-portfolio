import { useScroll, useSpring, motion } from "framer-motion";

// Signature element: a fixed vertical "signal trace" that fills as the
// visitor scrolls, like an oscilloscope reading of how far through the
// story they are. Ticks mark each section.
export default function SignalLine({ sections }) {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <div className="pointer-events-none fixed left-6 top-0 z-40 hidden h-screen items-center lg:flex xl:left-10">
      <div className="relative h-[46vh] w-px">
        <div className="absolute inset-0 bg-edge" />
        <motion.div
          style={{ scaleY: pathLength }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-signal via-signal-soft to-cyan shadow-glow-sm"
        />
        {sections.map((s, i) => (
          <div
            key={s}
            className="absolute -left-[3px] h-[7px] w-[7px] rounded-full border border-edge bg-void"
            style={{ top: `${(i / (sections.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
