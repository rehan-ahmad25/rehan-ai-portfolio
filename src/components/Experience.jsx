import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "../data/experience";
import SectionEyebrow from "./SectionEyebrow";
import AmbientBlobs from "./ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const trackRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: trackRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
    }, trackRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative overflow-hidden py-32 lg:py-44">
      <AmbientBlobs variant="cyan" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-20"
        >
          <SectionEyebrow number="04" label="EXPERIENCE" />
          <h2 className="max-w-xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
            From intelligent ideas to real <span className="text-gradient italic"> AI </span>products.
          </h2>
        </motion.div>
        

        <div ref={trackRef} className="relative">
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-edge md:left-[7px]" />
          <div
            ref={lineRef}
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-signal via-signal-soft to-cyan"
          />

          <div className="space-y-16">
            {experience.map((e) => (
              <motion.div
                key={e.org}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                className="group relative -mx-5 rounded-2xl px-5 py-3 pl-10 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <span className="absolute left-0 top-5 h-3.5 w-3.5 rounded-full border-2 border-signal bg-void shadow-glow-sm transition-transform duration-300 group-hover:scale-125" />

                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <h3 className="text-2xl text-ink transition-colors duration-300 group-hover:text-signal-soft md:text-[1.7rem]">
                    {e.role}{" "}
                    <span className="text-ink-dim">— {e.org}</span>
                  </h3>
                  <span className="font-mono text-xs text-ink-dim">
                    {e.period} · {e.location}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
                  {e.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-3 py-1 font-mono text-[11px] text-ink-dim transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal/10 hover:text-signal-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
