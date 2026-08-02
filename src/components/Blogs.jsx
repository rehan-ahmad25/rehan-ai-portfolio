import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import blogs from "../data/blogs";
import BlogCard from "./blog/BlogCard";
import SectionEyebrow from "./SectionEyebrow";
import AmbientBlobs from "./ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";

export default function Blogs() {
  const featured = blogs.slice(0, 3);

  return (
    <section id="blogs" className="relative overflow-hidden py-32 lg:py-44">
      <AmbientBlobs variant="cyan" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <SectionEyebrow number="05" label="BLOGS" />
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <h2 className="font-display text-4xl font-normal leading-[1.15] md:text-5xl">
              Notes from the <span className="text-gradient italic">frontier</span>.
            </h2>
            <Link
              to="/blogs"
              data-cursor-hover
              className="link-sweep flex items-center gap-1.5 font-body text-sm text-ink-muted transition-colors hover:text-ink"
            >
              All posts <HiOutlineArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
