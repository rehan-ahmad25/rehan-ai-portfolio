import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="font-mono text-sm text-signal-soft">404</span>
      <h1 className="mt-4 font-display text-3xl font-normal text-ink md:text-4xl">
        That page doesn't exist.
      </h1>
      <p className="mt-3 max-w-sm text-ink-muted">
        The link might be old, or mistyped. Let's get you back to somewhere
        real.
      </p>
      <Link
        to="/"
        data-cursor-hover
        className="link-sweep mt-8 inline-flex items-center gap-2 font-mono text-[13px] text-ink transition-colors hover:text-signal-soft"
      >
        <HiOutlineArrowLeft aria-hidden="true" /> Back to home
      </Link>
    </div>
  );
}
