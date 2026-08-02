import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initLenis, destroyLenis } from "./lenis";

gsap.registerPlugin(ScrollTrigger);

// Sets up buttery smooth scrolling for the whole page and keeps GSAP's
// ScrollTrigger perfectly in sync with it. Driving Lenis through
// gsap.ticker (instead of its own independent requestAnimationFrame loop)
// and forwarding Lenis's scroll events to ScrollTrigger.update are the
// two things that stop scroll-linked GSAP animations (see Experience.jsx)
// from drifting or stuttering relative to what's visually on screen.
// Respects prefers-reduced-motion by skipping the custom easing entirely.
export default function useLenis() {
  useEffect(() => {
    // Scroll-linked triggers (see Experience.jsx) measure element positions
    // at mount time. Fraunces/Inter load asynchronously and swap in after
    // first paint, reflowing text — without this, ScrollTrigger's cached
    // start/end offsets can drift from where content actually ends up,
    // making the timeline draw-in fire at the wrong scroll position. This
    // runs regardless of Lenis/reduced-motion since ScrollTrigger is used
    // either way.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    const lenis = initLenis();
    if (!lenis) return; // reduced-motion: native scroll only

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      destroyLenis();
    };
  }, []);
}
