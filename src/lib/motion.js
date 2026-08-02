// Shared animation variants so every section reveals with the same
// premium, consistent easing instead of ad-hoc per-component curves.

export const easeOut = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export const fadeUpBig = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: easeOut } },
};

// A clip-path "curtain rise" reveal — reads as more premium than a plain
// fade for large display headings.
export const revealMask = {
  hidden: { opacity: 0, y: 18, clipPath: "inset(0 0 100% 0)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.9, ease: easeOut },
  },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});
