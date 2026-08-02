// Eagerly imports every markdown file under src/content/blog/*.md as raw
// text, keyed by filename (without extension) so BlogPost/BlogList can
// look up a post's body by its `id`. Eager + raw keeps this simple for a
// blog this size; if the post count grows a lot, swap `eager: true` for
// per-route lazy imports.
const modules = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const contentBySlug = {};
for (const path in modules) {
  const slug = path.match(/([^/]+)\.md$/)[1];
  contentBySlug[slug] = modules[path];
}

export function getPostContent(id) {
  return contentBySlug[id] || "";
}
