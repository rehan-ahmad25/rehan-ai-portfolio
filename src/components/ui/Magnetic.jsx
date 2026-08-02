import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";

/**
 * Wraps a button/link and nudges it a few pixels toward the cursor on
 * hover, springing back on release — a common "expensive" micro-interaction
 * on Awwwards-tier sites. Strength is kept small so it reads as premium,
 * not gimmicky. No-ops when the visitor prefers reduced motion.
 */
export default function Magnetic({ children, strength = 0.35, className = "", as: Component = motion.div, ...props }) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const handleMove = (e) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}
