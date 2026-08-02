import {
  HiOutlineInformationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineLightBulb,
} from "react-icons/hi2";

const VARIANTS = {
  note: {
    label: "Note",
    icon: HiOutlineInformationCircle,
    color: "#4C8DFF",
  },
  warning: {
    label: "Warning",
    icon: HiOutlineExclamationTriangle,
    color: "#F2B559",
  },
  tip: {
    label: "Tip",
    icon: HiOutlineLightBulb,
    color: "#5FD9A0",
  },
};

// Renders GitHub-style callout blockquotes: `> [!NOTE] ...`, `> [!WARNING]
// ...`, `> [!TIP] ...`. Keeping the source convention plain markdown (no
// custom component syntax) means the articles stay portable, plain .md
// files — ArticleRenderer just intercepts blockquotes at render time and
// swaps in this component when it spots the marker (see
// src/lib/calloutParser.js).
export default function Callout({ variant = "note", children }) {
  const config = VARIANTS[variant] || VARIANTS.note;
  const Icon = config.icon;

  return (
    <div
      className="glass my-8 flex gap-3.5 rounded-2xl border-l-2 p-5"
      style={{ borderLeftColor: config.color }}
    >
      <Icon
        aria-hidden="true"
        className="mt-0.5 shrink-0"
        style={{ color: config.color, fontSize: "1.15rem" }}
      />
      <div className="min-w-0 flex-1 text-[15px] leading-[1.75] text-ink-muted [&_p]:m-0 [&_strong]:text-ink">
        <span
          className="mb-1 block font-mono text-[10px] uppercase tracking-widest"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        {children}
      </div>
    </div>
  );
}
