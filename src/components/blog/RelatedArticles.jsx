import BlogCard from "./BlogCard";

export default function RelatedArticles({ posts }) {
  if (posts.length === 0) return null;

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-dim">
        Related articles
      </span>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <BlogCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
