import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowUpRight,
  HiOutlineCalendar,
  HiOutlineClock,
} from "react-icons/hi2";
import { FaGithub } from "react-icons/fa6";
import blogs from "../data/blogs";
import projects from "../data/projects";
import { getPostContent } from "../lib/blogContent";
import ArticleRenderer from "../components/blog/ArticleRenderer";
import TableOfContents from "../components/blog/TableOfContents";
import ReadingProgressBar from "../components/blog/ReadingProgressBar";
import AuthorCard from "../components/blog/AuthorCard";
import ShareButtons from "../components/blog/ShareButtons";
import NewsletterCard from "../components/blog/NewsletterCard";
import RelatedArticles from "../components/blog/RelatedArticles";
import PostNavigation from "../components/blog/PostNavigation";
import AmbientBlobs from "../components/ui/AmbientBlobs";
import Magnetic from "../components/ui/Magnetic";
import NotFound from "./NotFound";
import { scrollToTopInstant } from "../lib/lenis";
import { fadeUp } from "../lib/motion";

const MotionLink = motion(Link);

export default function BlogPost() {
  const { slug } = useParams();
  const contentRef = useRef(null);

  const index = blogs.findIndex((b) => b.id === slug);
  const post = index >= 0 ? blogs[index] : null;
  const content = post ? getPostContent(post.id) : "";
  const relatedProject = post
    ? projects.find((p) => p.id === post.relatedProject)
    : null;

  const related = useMemo(() => {
    if (!post) return [];
    return blogs
      .filter((b) => b.id !== post.id && b.tag === post.tag)
      .slice(0, 3)
      .concat(blogs.filter((b) => b.id !== post.id && b.tag !== post.tag))
      .slice(0, 3);
  }, [post]);

  useEffect(() => {
    scrollToTopInstant();
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const prevTitle = document.title;
    document.title = `${post.title} — Rehan Ahmad`;
    return () => {
      document.title = prevTitle;
    };
  }, [post]);

  if (!post) return <NotFound />;

  const prev = index > 0 ? blogs[index - 1] : null;
  const next = index < blogs.length - 1 ? blogs[index + 1] : null;

  return (
    <article className="relative pb-32 pt-32 lg:pt-40">
      <ReadingProgressBar targetRef={contentRef} />
      <AmbientBlobs variant="cyan" />

      <div ref={contentRef}>
        <div className="relative mx-auto max-w-3xl px-6 lg:px-0">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Link
              to="/blogs"
              data-cursor-hover
              className="link-sweep mb-8 inline-flex items-center gap-2 font-mono text-[12px] text-ink-muted transition-colors hover:text-ink"
            >
              <HiOutlineArrowLeft aria-hidden="true" /> All posts
            </Link>

            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider"
              style={{
                color: post.color,
                background: `${post.color}1a`,
                border: `1px solid ${post.color}40`,
              }}
            >
              {post.tag}
            </span>

            <h1 className="mt-5 font-display text-4xl font-normal leading-[1.12] text-ink md:text-5xl">
              {post.title}
            </h1>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <AuthorCard />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 font-mono text-[12px] text-ink-dim">
                  <span className="flex items-center gap-1.5">
                    <HiOutlineCalendar aria-hidden="true" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HiOutlineClock aria-hidden="true" /> {post.readTime}
                  </span>
                </div>
                <ShareButtons title={post.title} />
              </div>
            </div>
          </motion.div>

          {post.cover && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.7,
      delay: 0.1,
      ease: [0.16, 1, 0.3, 1],
    }}
    className="glow-border mt-10 overflow-hidden rounded-3xl border border-edge bg-[#0b0b0f]"
  >
    <img
      src={post.cover}
      alt={post.title}
      fetchPriority="high"
      className="w-full h-auto object-contain"
    />
  </motion.div>
)}
        </div>

        {/* content + sticky TOC */}
        <div className="relative mx-auto mt-14 grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_260px] lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto w-full max-w-3xl lg:mx-0"
          >
            <ArticleRenderer content={content} />
          </motion.div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <TableOfContents content={content} />
            </div>
          </aside>
        </div>
      </div>

      {/* bottom section — deliberately outside the reading-progress ref;
          this is cross-navigation, not article content, so it shouldn't
          count toward "how far through the article" the bar reports */}
      <div className="mx-auto mt-20 max-w-3xl space-y-14 px-6 lg:px-0">
        {(relatedProject || post.githubUrl) && (
          <div className="flex flex-wrap gap-3 border-t border-edge-soft pt-10">
            {post.githubUrl && (
              <Magnetic
                as={motion.a}
                strength={0.25}
                href={post.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 font-body text-[13px] font-medium text-ink transition-colors hover:border-signal/50 hover:bg-white/5"
              >
                <FaGithub aria-hidden="true" /> GitHub Repository
              </Magnetic>
            )}
            
          </div>
        )}

        <PostNavigation prev={prev} next={next} />

        <RelatedArticles posts={related} />

        <NewsletterCard />

        <div className="flex justify-center border-t border-edge-soft pt-10">
          <Link
            to="/"
            data-cursor-hover
            className="link-sweep flex items-center gap-2 font-mono text-[13px] text-ink-muted transition-colors hover:text-ink"
          >
            <HiOutlineArrowLeft aria-hidden="true" /> Back to portfolio
          </Link>
        </div>
      </div>
    </article>
  );
}
