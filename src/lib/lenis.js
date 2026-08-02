import Lenis from "lenis";

// A single shared Lenis instance for the whole app. Centralizing it means
// anything that needs to scroll programmatically (nav links, the hero
// CTAs, "back to top") goes through the same virtual scroll state that
// GSAP ScrollTrigger is synced to below — calling the native
// `element.scrollIntoView()` while Lenis is active fights its rAF-driven
// physics and visibly stutters, so nothing in the app should use that API
// directly once Lenis is running.
let lenisInstance = null;

export function initLenis() {
  if (lenisInstance || typeof window === "undefined") return lenisInstance;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return null;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function destroyLenis() {
  lenisInstance?.destroy();
  lenisInstance = null;
}

/**
 * Scrolls to a selector using Lenis when it's running, falling back to
 * native smooth scroll for reduced-motion visitors (where Lenis is never
 * initialized).
 */
export function scrollToSelector(selector, options = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -8, ...options });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Instantly resets scroll position — used on route changes (e.g. landing
 * on a fresh blog post) where a smooth animated scroll would be the wrong
 * feel. Goes through Lenis so its internal scroll-position tracking stays
 * in sync instead of drifting from a raw `window.scrollTo`.
 */
export function scrollToTopInstant() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }
}

/**
 * Smoothly scrolls to the top of whatever page is currently mounted —
 * unlike scrollToSelector("#top"), this doesn't depend on a "#top" element
 * existing (it only does on the home page), so it's safe to use from the
 * footer's "back to top" button on any route.
 */
export function scrollToTopSmooth() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
