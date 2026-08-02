import { Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi2";

export default function PostNavigation({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {prev ? (
        <Link
          to={`/blogs/${prev.id}`}
          data-cursor-hover
          className="glow-border sheen glass group flex flex-col justify-center rounded-2xl p-5 transition-colors duration-300 hover:border-signal/30"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            <HiOutlineArrowLeft aria-hidden="true" /> Previous
          </span>
          <span className="mt-2 font-display text-base leading-snug text-ink transition-colors group-hover:text-signal-soft">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to={`/blogs/${next.id}`}
          data-cursor-hover
          className="glow-border sheen glass group flex flex-col items-end justify-center rounded-2xl p-5 text-right transition-colors duration-300 hover:border-signal/30"
        >
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            Next <HiOutlineArrowRight aria-hidden="true" />
          </span>
          <span className="mt-2 font-display text-base leading-snug text-ink transition-colors group-hover:text-signal-soft">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
