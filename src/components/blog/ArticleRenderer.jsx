import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";
import Callout from "./Callout";
import { parseCalloutVariant, stripCalloutMarker } from "../../lib/calloutParser";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("yaml", yaml);

// A code theme hand-tuned to the portfolio's palette instead of importing
// one of Prism's stock themes wholesale — keeps code blocks feeling like
// part of the same design system rather than a pasted-in widget.
const codeTheme = {
  'code[class*="language-"]': { color: "#C7CEDE", fontFamily: "JetBrains Mono, monospace" },
  comment: { color: "#7B84A3", fontStyle: "italic" },
  string: { color: "#7CE7E1" },
  keyword: { color: "#7FA9FF" },
  function: { color: "#A78BFA" },
  number: { color: "#F2B559" },
  operator: { color: "#C7CEDE" },
  "class-name": { color: "#7FA9FF" },
  builtin: { color: "#7FA9FF" },
  punctuation: { color: "#8891A8" },
};

export default function ArticleRenderer({ content }) {
  return (
    <div className="article-body space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          // Article bodies should never contain their own h1 — the page
          // title (rendered once, above this component) is the single h1
          // for correct document outline. If a future edit to the
          // markdown accidentally adds a "# Heading", downgrade it to the
          // same treatment as h2 rather than emitting a second h1.
          h1: ({ children, id }) => (
            <h2
              id={id}
              className="!mt-16 scroll-mt-28 font-display text-2xl font-normal text-ink md:text-[1.75rem]"
            >
              {children}
            </h2>
          ),
          h2: ({ children, id }) => (
            <h2
              id={id}
              className="!mt-16 scroll-mt-28 font-display text-2xl font-normal text-ink md:text-[1.75rem]"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className="!mt-10 scroll-mt-28 font-display text-xl text-ink">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[16.5px] leading-[1.8] text-ink-muted">{children}</p>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="link-sweep text-ink transition-colors hover:text-signal-soft"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="space-y-2.5 pl-1">{children}</ul>,
          ol: ({ children }) => (
            <ol className="space-y-2.5 pl-1 [counter-reset:item]">{children}</ol>
          ),
          li: ({ children, ordered }) => (
            <li
              className={`flex gap-3 text-[16.5px] leading-[1.8] text-ink-muted ${
                ordered ? "[counter-increment:item]" : ""
              }`}
            >
              {ordered ? (
                <span className="mt-[3px] shrink-0 font-mono text-sm text-signal-soft before:content-[counter(item)]" />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-signal-soft"
                />
              )}
              <span className="min-w-0">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => {
            const variant = parseCalloutVariant(children);
            if (variant) {
              return <Callout variant={variant}>{stripCalloutMarker(children)}</Callout>;
            }
            return (
              <blockquote className="border-l-2 border-signal/50 py-1 pl-5 font-display text-lg italic leading-relaxed text-ink">
                {children}
              </blockquote>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match && !String(children).includes("\n");

            if (isInline) {
              return (
                <code
                  className="rounded-md border border-edge-soft bg-surface-2/80 px-1.5 py-0.5 font-mono text-[0.85em] text-signal-soft"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const lang = match?.[1] || "text";
            const raw = String(children).replace(/\n$/, "");

            // Architecture/system diagrams are plain ASCII, not code — run
            // them through as a monospace panel instead of the syntax
            // highlighter so box-drawing characters and spacing stay exact.
            if (lang === "diagram" || lang === "ascii") {
              return (
                <div className="glow-border my-8 overflow-x-auto rounded-2xl border border-edge bg-surface-2/60 p-6">
                  <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-signal-soft">
                    Architecture
                  </span>
                  <pre className="font-mono text-[12.5px] leading-relaxed text-ink-muted">
                    {raw}
                  </pre>
                </div>
              );
            }

            return (
              <div className="group relative my-8 overflow-hidden rounded-2xl border border-edge">
                <div className="flex items-center justify-between border-b border-edge-soft bg-surface-2/80 px-4 py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                    {lang}
                  </span>
                </div>
                <SyntaxHighlighter
                  language={lang}
                  style={codeTheme}
                  customStyle={{
                    margin: 0,
                    padding: "1.25rem",
                    background: "rgba(11,15,26,0.6)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                  }}
                  codeTagProps={{ style: { fontFamily: "JetBrains Mono, monospace" } }}
                >
                  {raw}
                </SyntaxHighlighter>
              </div>
            );
          },
          img: ({ src, alt }) => (
            <figure className="my-8">
              <div className="glow-border overflow-hidden rounded-2xl border border-edge">
                <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />
              </div>
              {alt && (
                <figcaption className="mt-3 text-center font-mono text-[12px] text-ink-dim">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="glass my-8 overflow-x-auto rounded-2xl border border-edge">
              <table className="w-full border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-edge-soft bg-white/[0.03]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-edge-soft px-4 py-3 text-[14px] text-ink-muted">
              {children}
            </td>
          ),
          hr: () => <hr className="my-12 border-edge-soft" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
