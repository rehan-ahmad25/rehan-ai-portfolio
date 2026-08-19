import { Suspense, lazy, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HiArrowDown, HiOutlineArrowUpRight } from "react-icons/hi2";
import { HiOutlineDownload } from "react-icons/hi";
import Magnetic from "./ui/Magnetic";
import AmbientBlobs from "./ui/AmbientBlobs";
import usePrefersReducedMotion from "../lib/usePrefersReducedMotion";
import { scrollToSelector } from "../lib/lenis";

const NeuralField = lazy(() => import("./NeuralField"));

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.2 },
  },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const sceneRef = useRef(null);
  const sceneInView = useInView(sceneRef, { margin: "200px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-28"
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <AmbientBlobs />
      <div className="bg-grid-fade absolute inset-0" />
      <div className="bg-noise absolute inset-0 z-[1]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-16 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.div variants={item} className="mb-7">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-edge bg-surface/60 py-1.5 pl-3 pr-4">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.2em] text-ink-muted">
                AVAILABLE FOR AI ENGINEERING ROLES · 2026
              </span>
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[15vw] font-normal leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.4rem]"
          >
            <span className="text-ink">Rehan </span>
            <span className="text-gradient italic">Ahmad</span>
          </motion.h1>

          <motion.p
  variants={item}
  className="mt-5 text-base text-ink-muted md:text-lg"
>
  AI Developer <span className="mx-2 text-ink-dim">·</span>{" "}
  ML Engineer <span className="mx-2 text-ink-dim">·</span>{" "}
  Web Developer
</motion.p>

          <motion.p
  variants={item}
  className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg"
>
  I’m <span className="text-ink">Rehan Ahmad</span>, an{" "}
  <span className="text-ink">AI Developer and ML Engineer</span>{" "}
  building <span className="text-ink">production-ready AI systems</span>{" "}
  across <span className="text-ink">Large Language Models</span>,{" "}
  <span className="text-ink">RAG</span>,{" "}
  <span className="text-ink">Voice AI</span>, and{" "}
  <span className="text-ink">Computer Vision</span> —{" "}
  with modern <span className="text-ink">web applications</span>{" "}
  to bring them to life.
</motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic
              as={motion.a}
              strength={0.3}
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToSelector("#work");
              }}
              data-cursor-hover
              className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-body text-[14px] font-medium text-void shadow-[0_0_0_rgba(76,141,255,0)] transition-shadow duration-300 hover:shadow-glow"
            >
              Explore Projects <HiOutlineArrowUpRight aria-hidden="true" />
            </Magnetic>
            <Magnetic
              as={motion.a}
              strength={0.3}
              href="/resume.pdf"
              download
              data-cursor-hover
              className="flex items-center gap-2 rounded-full border border-edge bg-surface/60 px-7 py-3.5 font-body text-[14px] font-medium text-ink transition-colors hover:border-signal/50 hover:bg-white/5"
            >
              <HiOutlineDownload aria-hidden="true" /> Download Resume
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Right side: 3D AI scene — a neural graph rendered with react-three-fiber */}
        <motion.div
          ref={sceneRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative h-[380px] sm:h-[460px] lg:col-span-5 lg:h-[600px]"
          aria-hidden="true"
        >
          {/* orbit rings */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[92%] w-[92%] rounded-full border border-signal/15" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[70%] w-[70%] rounded-full border border-signal/10" />
          </div>

          <div className="absolute inset-0">
            {prefersReducedMotion ? (
              <StaticScene />
            ) : (
              <Suspense fallback={<SceneFallback />}>
                <NeuralField paused={!sceneInView} />
              </Suspense>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 1, duration: 0.8 },
              y: { delay: 1.6, duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="glass sheen absolute left-0 top-[18%] rounded-xl px-4 py-2.5 shadow-glow-sm sm:left-[6%]"
          >
            <div className="font-mono text-[11px] text-signal-soft">model.eval()</div>
            <div className="font-mono text-[11px] text-ink-dim">
              tokens/sec: <span className="text-cyan">142.7</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.8 },
              y: { delay: 1.8, duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="glass sheen absolute bottom-[10%] right-0 rounded-xl px-4 py-2.5 shadow-glow-sm sm:right-[2%]"
          >
            <div className="font-mono text-[11px] text-ink-dim">
              inference latency: <span className="text-signal-soft">38ms</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-ink-dim">
          SCROLL
        </span>
        <HiArrowDown aria-hidden="true" className="animate-float text-signal-soft" />
      </motion.div>
    </section>
  );
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-2 w-2 animate-pulse-line rounded-full bg-signal-soft" />
    </div>
  );
}

function StaticScene() {
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        background:
          "radial-gradient(circle at 35% 30%, rgba(127,169,255,0.9), rgba(76,141,255,0.5) 45%, rgba(5,7,13,0) 72%)",
      }}
    />
  );
}
