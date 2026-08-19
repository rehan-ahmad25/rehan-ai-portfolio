import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { stats } from "../data/experience";
import SectionEyebrow from "./SectionEyebrow";
import TiltCard from "./ui/TiltCard";
import AmbientBlobs from "./ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden py-32 lg:py-44">
      <AmbientBlobs />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <SectionEyebrow number="01" label="ABOUT" />
         <h2 className="max-w-2xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
  I’m <span className="text-ink">Rehan Ahmad</span> — I sit between research and production,{" "}
  <span className="text-ink-muted">
    where a model that works in a notebook has to survive real traffic.
  </span>
</h2>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="lg:col-span-4"
          >
            <ProfilePortrait />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-6 lg:col-span-8"
          >
            <p className="text-lg leading-relaxed text-ink-muted">
  I'm <span className="text-ink">Rehan Ahmad</span>, an AI Developer and ML Engineer driven by the challenge of building intelligent software that people can actually use. I specialize in Large Language Models, Voice AI, Computer Vision, and Retrieval-Augmented Generation (RAG), combining modern machine learning with thoughtful engineering to build practical AI solutions.
</p>

<p className="text-lg leading-relaxed text-ink-muted">
  Whether it's developing AI assistants, intelligent automation, or computer vision applications, I enjoy turning complex ideas into seamless user experiences and building the web experiences that bring them to life, while continuously exploring the latest advancements in artificial intelligence.
</p>

            <div className="grid grid-cols-2 gap-6 pt-4 sm:grid-cols-4">
              {stats.map((s, i) => (
                <StatCounter key={s.label} stat={s} delay={i * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProfilePortrait() {
  return (
    <div className="relative mx-auto w-[300px] h-[420px] lg:mx-0">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-signal/20 via-transparent to-cyan/10 blur-2xl" />

      <TiltCard
        tiltStrength={10}
        className="glow-border sheen glass relative h-full w-full overflow-hidden rounded-[2rem] shadow-glow-sm"
      >
        {/* Grid Overlay */}
        <div className="grid-bg absolute inset-0 opacity-10 z-10" />

        {/* Profile Image */}
        <motion.img
          src="/rehan.png"
          alt="Rehan Ahmad"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent z-20" />

        {/* Name */}
        <span className="absolute bottom-5 left-5 z-30 font-mono text-[10px] uppercase tracking-[0.25em] text-white">
          Rehan Ahmad
        </span>

        {/* Badge */}
        <span className="absolute right-5 top-5 z-30 rounded-full bg-signal/20 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-signal-soft backdrop-blur">
          AI Developer
        </span>
      </TiltCard>
    </div>
  );
}

function StatCounter({ stat, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  // Parse the numeric portion of the stat so we can animate it counting up,
  // while preserving any suffix (e.g. "5+") or decimal (e.g. "3.90").
  const match = stat.value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const numeric = match ? parseFloat(match[1]) : null;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

  useEffect(() => {
    if (!inView) return;
    if (numeric === null) {
      setDisplay(stat.value);
      return;
    }
    const controls = animate(0, numeric, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, numeric, decimals, delay, stat.value]);

  return (
    <div
      ref={ref}
      className="group border-l border-edge pl-4 transition-colors duration-300 hover:border-signal/60"
    >
      <div className="font-mono text-2xl text-ink transition-colors duration-300 group-hover:text-signal-soft md:text-3xl">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-xs leading-snug text-ink-dim">{stat.label}</div>
    </div>
  );
}
