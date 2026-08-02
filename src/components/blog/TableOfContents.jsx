import { useEffect, useMemo, useState } from "react";
import GithubSlugger from "github-slugger";
import { scrollToSelector } from "../../lib/lenis";

// Extracts h2/h3 lines straight from the raw markdown source, generating
// ids with the same slugger rehype-slug uses on the rendered output — so
// links here always match the real heading ids, even if two headings
// share text (the slugger de-dupes with -1, -2, ... suffixes the same way
// on both sides).
function extractHeadings(markdown) {
  const slugger = new GithubSlugger();
  const lines = markdown.split("\n");
  const headings = [];

  for (const line of lines) {
    const match = line.match(/^(##|###)\s+(.*)$/);
    if (!match) continue;
    const depth = match[1].length;
    const text = match[2].trim();
    headings.push({ depth, text, id: slugger.slug(text) });
  }
  return headings;
}

export default function TableOfContents({ content }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="glass rounded-2xl p-5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
        On this page
      </span>
      <ul className="mt-4 space-y-1 border-l border-edge-soft">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li key={h.id} style={{ paddingLeft: h.depth === 3 ? "1.5rem" : "1rem" }}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSelector(`#${h.id}`);
                  window.history.replaceState(null, "", `#${h.id}`);
                }}
                data-cursor-hover
                className={`-ml-px block border-l py-1.5 pl-3 text-[13px] leading-snug transition-colors ${
                  isActive
                    ? "border-signal-soft text-ink"
                    : "border-transparent text-ink-dim hover:text-ink-muted"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
