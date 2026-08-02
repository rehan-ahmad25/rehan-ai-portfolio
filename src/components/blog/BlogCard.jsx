import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineArrowRight,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi2";
import TiltCard from "../ui/TiltCard";

const MotionLink = motion(Link);

export default function BlogCard({ post, index = 0, featured = false }) {
  return (
    <TiltCard
      as={MotionLink}
      to={`/blogs/${post.id}`}
      data-cursor-hover
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
        },
      }}
      whileHover={{ y: -6 }}
      tiltStrength={5}
      className="glow-border sheen group flex flex-col overflow-hidden rounded-3xl border border-edge bg-surface/60 transition-colors duration-300 hover:border-white/20"
    >
      {/* cover image */}
      <div className="relative h-44 overflow-hidden border-b border-edge-soft">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${post.color}22, transparent 70%)`,
          }}
        />
        {post.cover && (
          <motion.img
            src={post.cover}
            alt=""
            loading="lazy"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />

        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
          style={{
            color: post.color,
            background: `${post.color}1a`,
            border: `1px solid ${post.color}40`,
          }}
        >
          {post.tag}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 font-mono text-[11px] text-ink-dim">
          <span className="flex items-center gap-1.5">
            <HiOutlineCalendar aria-hidden="true" /> {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineClock aria-hidden="true" /> {post.readTime}
          </span>
        </div>

        <h3
          className={`mt-4 flex-1 font-display leading-snug text-ink transition-colors group-hover:text-signal-soft ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>

        <span className="mt-6 flex items-center gap-1 font-body text-[13px] font-medium text-ink transition-transform group-hover:translate-x-1">
          Read Article <HiOutlineArrowRight aria-hidden="true" />
        </span>
      </div>
    </TiltCard>
  );
}
