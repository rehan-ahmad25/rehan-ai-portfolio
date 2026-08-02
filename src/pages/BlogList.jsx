import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import blogs from "../data/blogs";
import BlogCard from "../components/blog/BlogCard";
import AmbientBlobs from "../components/ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";
import { scrollToTopInstant } from "../lib/lenis";

export default function BlogList() {
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    scrollToTopInstant();
    document.title = "Writing — Rehan Ahmad";
  }, []);

  const tags = useMemo(() => ["All", ...new Set(blogs.map((b) => b.tag))], []);
  const filtered = useMemo(
    () => (activeTag === "All" ? blogs : blogs.filter((b) => b.tag === activeTag)),
    [activeTag]
  );

  return (
    <div className="relative overflow-hidden pb-32 pt-36 lg:pt-44">
      <AmbientBlobs variant="cyan" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="mb-14">
          <span className="eyebrow">Writing</span>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
            Notes from the <span className="text-gradient italic">frontier</span>.
          </h1>
          <p className="mt-5 max-w-xl text-ink-muted">
            Engineering write-ups on the systems I've built — LLMs, RAG,
            voice AI, and computer vision, from first principles to
            production.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              data-cursor-hover
              aria-pressed={activeTag === tag}
              className={`rounded-full border px-4 py-1.5 font-mono text-[12px] transition-colors ${
                activeTag === tag
                  ? "border-signal/50 bg-signal/10 text-signal-soft"
                  : "border-edge text-ink-dim hover:border-edge hover:text-ink"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
