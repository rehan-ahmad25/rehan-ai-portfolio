import { useEffect, useRef } from "react";

// A soft signal-blue glow that replaces the native pointer. Desktop only —
// disabled on coarse (touch) pointers and for reduced-motion users, and the
// OS cursor is restored automatically whenever either of those is true.
export default function CustomCursor() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isCoarse || prefersReduced) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;
    let hasMoved = false;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        // Snap the trailing elements to the real cursor position on the
        // very first move instead of letting them visibly drift in from
        // the screen center where they were initialized.
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        glowX = mouseX;
        glowY = mouseY;
        rootRef.current?.classList.remove("opacity-0");
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const grow = () => {
      ringRef.current?.classList.add("scale-[2.4]", "opacity-70", "border-signal");
      glowRef.current?.classList.add("scale-150", "opacity-60");
    };
    const shrink = () => {
      ringRef.current?.classList.remove("scale-[2.4]", "opacity-70", "border-signal");
      glowRef.current?.classList.remove("scale-150", "opacity-60");
    };
    const hide = () => rootRef.current?.classList.add("opacity-0");
    const show = () => rootRef.current?.classList.remove("opacity-0");

    // Delegate via mouseover so elements added after mount (cards, buttons
    // rendered on scroll-into-view) are still picked up automatically.
    const onOver = (e) => {
      if (e.target.closest?.("input, textarea")) {
        hide();
        return;
      }
      if (e.target.closest?.("a, button, [data-cursor-hover]")) grow();
    };
    const onOut = (e) => {
      if (e.target.closest?.("input, textarea")) {
        show();
        return;
      }
      if (e.target.closest?.("a, button, [data-cursor-hover]")) shrink();
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-[100] hidden opacity-0 transition-opacity duration-300 md:block"
    >
      <div
        ref={glowRef}
        className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-signal/10 blur-2xl transition-transform duration-300 ease-out"
      />
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-signal-soft"
      />
      <div
        ref={ringRef}
        className="absolute -left-4 -top-4 h-8 w-8 rounded-full border border-signal/50 transition-transform duration-200 ease-out"
      />
    </div>
  );
}
