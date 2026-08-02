import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import usePrefersReducedMotion from "../../lib/usePrefersReducedMotion";

/**
 * Wraps children in a card that gently tilts toward the cursor in 3D and
 * tracks a mouse-position spotlight (via the .spotlight CSS utility).
 * The tilt/spotlight tracking is skipped entirely when the visitor prefers
 * reduced motion — the card still renders with its static hover styles
 * (border glow, background), just without the pointer-driven motion.
 */
export default function TiltCard({
  children,
  className = "",
  as: Component = motion.div,
  tiltStrength = 8,
  glare = true,
  spotlightClass = "spotlight",
  ...props
}) {
  const ref = useRef(null);
  const reduceMotion = usePrefersReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springConfig = { stiffness: 180, damping: 18, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(my, [0, 1], [tiltStrength, -tiltStrength]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mx, [0, 1], [-tiltStrength, tiltStrength]),
    springConfig
  );

  const handleMove = (e) => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px);
    my.set(py);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 900 }
      }
      className={`${spotlightClass} ${className}`}
      {...props}
    >
      {children}
      {glare && !reduceMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.06), transparent 60%)",
          }}
        />
      )}
    </Component>
  );
}
