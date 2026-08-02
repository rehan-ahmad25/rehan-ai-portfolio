import { motion } from "framer-motion";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa6";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineMicrophone,
  HiOutlineEye,
  HiOutlineChartBar,
} from "react-icons/hi2";
import projects from "../data/projects";
import SectionEyebrow from "./SectionEyebrow";
import TiltCard from "./ui/TiltCard";
import Magnetic from "./ui/Magnetic";
import { fadeUp } from "../lib/motion";

const iconMap = {
  chat: HiOutlineChatBubbleLeftRight,
  voice: HiOutlineMicrophone,
  vision: HiOutlineEye,
  data: HiOutlineChartBar,
};

export default function Projects() {
  return (
    <section id="work" className="relative py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-20"
        >
          <SectionEyebrow number="03" label="PROJECTS" />
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
              Systems that shipped, not just{" "}
              <span className="text-gradient italic">prototypes</span> that demoed.
            </h2>
            <p className="max-w-xs text-sm leading-relaxed text-ink-dim">
             A curated collection of AI projects spanning LLMs, RAG systems, computer vision, voice AI, and production-ready machine learning solutions.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  const Icon = iconMap[project.image] || HiOutlineChatBubbleLeftRight;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      transition={{ delay: (index % 2) * 0.1 }}
      className="flex flex-col"
    >
      {/* visual area */}
      <TiltCard
        tiltStrength={4}
        className="glow-border sheen group relative overflow-hidden rounded-3xl border border-edge bg-surface/60"
      >
        {project.screenshot ? (
          <motion.img
            src={project.screenshot}
            alt={`${project.name} interface screenshot`}
            loading="lazy"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="h-52 w-full object-cover sm:h-60"
          />
        ) : (
          <>
            <div className="grid-bg absolute inset-0 opacity-40" />
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-52 items-center justify-center sm:h-60"
              style={{
                background: `radial-gradient(ellipse at 50% 45%, ${project.color}22, transparent 65%)`,
              }}
            >
              <span className="glass flex h-16 w-16 items-center justify-center rounded-2xl shadow-glow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Icon aria-hidden="true" style={{ color: project.color, fontSize: "1.9rem" }} />
              </span>
            </motion.div>
          </>
        )}

        {project.screenshot && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent" />
        )}

        <span className="absolute left-5 top-5 font-mono text-[11px] tracking-wide text-ink-dim">
          {String(index + 1).padStart(2, "0")} · {project.category.toUpperCase()}
        </span>
        <Magnetic
          as={motion.a}
          strength={0.5}
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-edge bg-void/40 text-ink transition-colors hover:border-signal/50 hover:text-signal-soft"
          aria-label={`Open ${project.name} GitHub repository`}
        >
          <HiOutlineArrowUpRight aria-hidden="true" />
        </Magnetic>
      </TiltCard>

      {/* content */}
      <div className="mt-7 flex flex-1 flex-col">
        <h3 className="font-display text-2xl font-normal text-ink md:text-3xl">
          {project.name}
        </h3>
        <p className="mt-2 font-mono text-sm text-signal-soft">
          {project.tagline}
        </p>
        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-muted">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-edge-soft px-3 py-1 font-mono text-[11px] text-ink-dim transition-all duration-200 hover:-translate-y-0.5 hover:border-signal/40 hover:text-signal-soft"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Magnetic
            as={motion.a}
            strength={0.25}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-edge px-5 py-2.5 font-body text-[13px] font-medium text-ink transition-colors hover:border-signal/50 hover:bg-white/5"
          >
            <FaGithub aria-hidden="true" /> GitHub
          </Magnetic>
          
        </div>
      </div>
    </motion.div>
  );
}