# Rehan Ahmad — AI Developer Portfolio

A premium, cinematic portfolio built with React, Vite, Tailwind CSS,
React Three Fiber, Framer Motion, GSAP, and Lenis.

## Sections
Hero · About · Skills · Experience · Projects · Blogs · Contact · Footer

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Customizing content

All editable content lives in `src/data/`:

- `projects.js` — project cards (name, description, tech stack, GitHub/demo links)
- `experience.js` — work/research experience, skill groups, hero stats, marquee items
- `blogs.js` — blog post **metadata** (title, tag, date, cover image, related project/GitHub link). The actual long-form article body for each post lives as a real markdown file in `src/content/blog/<id>.md`.

Update `src/components/Hero.jsx` for the name/tagline, and
`src/components/Contact.jsx` for your email/GitHub/LinkedIn links.

To use a real photo, drop it in `public/` and swap the placeholder markup
in `src/components/About.jsx` (`ProfilePortrait`) for an `<img>` tag.

## Blog system

Each post gets a real route at `/blogs/<id>` (list at `/blogs`) — "Read
Article" is a real link, not a placeholder. To add a new post:

1. Add an entry to `src/data/blogs.js` with a unique `id` (this becomes the
   URL slug), plus `title`, `excerpt`, `tag`, `color`, `date`, `readTime`,
   and `cover` (path under `public/`).
2. Write the article body as plain markdown in
   `src/content/blog/<id>.md`. Supported: headings (`##`/`###`), lists,
   tables, images, code blocks (syntax-highlighted), inline code, and
   callouts using the convention `> [!NOTE] ...`, `> [!WARNING] ...`,
   `> [!TIP] ...`. For an architecture/system diagram, use a fenced block
   with the language tag `diagram` (plain ASCII, rendered as a labeled
   panel instead of syntax-highlighted code).

Nothing else needs to change — the post automatically appears in the
Blogs grid on the home page, the full `/blogs` listing, and gets
prev/next + related-article links from its neighbors in the array.

**Known limitation — per-post social share previews.** This is a
client-only SPA (no server-side rendering), so while `document.title`
updates correctly per post as you browse, the static Open Graph/Twitter
meta tags in `index.html` are shared across every route. Most social
platforms and chat apps (X, LinkedIn, Slack, iMessage previews) fetch the
raw HTML without executing JavaScript, so a shared blog post link will
show the site-wide preview image/description, not that post's own cover
image and excerpt — even though the page itself looks correct once opened.
Search engines that do execute JavaScript (Google) aren't affected the
same way. Fixing this properly requires prerendering or SSR for the blog
routes (e.g. `vite-plugin-ssr`, Astro, or a Next.js migration) — worth
doing if per-post link previews matter for how these get shared, but
out of scope for a plain Vite SPA.

To add a downloadable résumé, place `resume.pdf` in the `public/` folder —
the hero button already links to `/resume.pdf`.
