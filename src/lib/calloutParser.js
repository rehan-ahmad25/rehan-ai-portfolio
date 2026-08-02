// Parses the GitHub-style callout convention used in the blog markdown
// source: `> [!NOTE] ...`, `> [!WARNING] ...`, `> [!TIP] ...`. Kept out of
// Callout.jsx so that file stays a component-only export (mixing plain
// function exports into a component file breaks React Fast Refresh).
//
// react-markdown gives blockquote `children` as an array that includes
// whitespace-only text nodes ("\n") interleaved with the actual <p>
// element(s) — e.g. ["\n", <p>...</p>, "\n"] — so the first *real* element
// has to be found by filtering those out, not assumed to be children[0].

function firstElementChild(children) {
  const list = Array.isArray(children) ? children : [children];
  return list.find((child) => child && typeof child === "object" && "props" in child);
}

export function parseCalloutVariant(children) {
  const firstParagraph = firstElementChild(children);
  const text = firstParagraph?.props?.children;
  const raw = Array.isArray(text) ? text[0] : text;
  if (typeof raw !== "string") return null;

  const match = raw.match(/^\[!(NOTE|WARNING|TIP)\]\s?/i);
  if (!match) return null;

  return match[1].toLowerCase();
}

export function stripCalloutMarker(children) {
  const list = Array.isArray(children) ? children : [children];
  const firstParagraph = firstElementChild(children);
  if (!firstParagraph) return children;

  const inner = firstParagraph.props.children;
  const innerList = Array.isArray(inner) ? inner : [inner];
  const [firstText, ...restInner] = innerList;
  const strippedText =
    typeof firstText === "string"
      ? firstText.replace(/^\[!(NOTE|WARNING|TIP)\]\s?/i, "")
      : firstText;

  const newParagraph = {
    ...firstParagraph,
    props: { ...firstParagraph.props, children: [strippedText, ...restInner] },
  };

  return list.map((child) => (child === firstParagraph ? newParagraph : child));
}
