import { motion, useScroll, useSpring } from "framer-motion";

// A thin progress bar fixed just under the navbar, filling as the visitor
// scrolls through the article container specifically (not the whole page
// — the byline, TOC, and bottom section shouldn't count toward "reading
// progress").
export default function ReadingProgressBar({ targetRef }) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-40 h-[2px] bg-transparent"
    >
      <motion.div
        style={{ scaleX: progress }}
        className="h-full w-full origin-left bg-gradient-to-r from-signal via-signal-soft to-cyan"
      />
    </div>
  );
}
