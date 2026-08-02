import { motion } from "framer-motion";
import {
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineSparkles,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";
import { skillGroups } from "../data/experience";
import SectionEyebrow from "./SectionEyebrow";
import TiltCard from "./ui/TiltCard";
import AmbientBlobs from "./ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";

const iconMap = {
  code: HiOutlineCommandLine,
  ai: HiOutlineCpuChip,
  backend: HiOutlineServerStack,
  agents: HiOutlineSparkles,
  tools: HiOutlineWrenchScrewdriver,
};

const tints = [
  "from-signal/15 via-transparent to-transparent",
  "from-[#7A5CFF]/15 via-transparent to-transparent",
  "from-cyan/15 via-transparent to-transparent",
  "from-signal-soft/15 via-transparent to-transparent",
];

const iconTints = ["text-signal-soft", "text-[#A78BFA]", "text-cyan", "text-signal-soft"];

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-32 lg:py-44">
      <AmbientBlobs variant="violet" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <SectionEyebrow number="02" label="SKILLS" />
          <h2 className="max-w-2xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
            The tools I <span className="text-gradient italic">reach for</span>{" "}
            to ship intelligence.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {skillGroups.map((group, gi) => {
            const Icon = iconMap[group.icon];
            return (
              <TiltCard
                key={group.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                transition={{ delay: gi * 0.08 }}
                tiltStrength={6}
                className="glow-border group relative overflow-hidden rounded-3xl border border-edge bg-surface/60 p-7 transition-colors duration-300 hover:border-white/20"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70 ${tints[gi % tints.length]}`}
                />
                <div className="relative">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-surface-2/60 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${iconTints[gi % iconTints.length]}`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg text-ink">
                    {group.title}
                  </h3>
                  <div className="mt-5 space-y-1">
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className="group/item flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 -mx-2.5 text-[13.5px] text-ink-muted transition-all duration-200 hover:bg-white/[0.06] hover:text-ink hover:pl-3.5"
                      >
                        <span
                          className={`h-1 w-1 shrink-0 rounded-full bg-ink-dim transition-all duration-200 group-hover/item:scale-150 group-hover/item:shadow-glow-sm ${iconTints[gi % iconTints.length]} group-hover/item:bg-current`}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
