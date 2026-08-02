import { motion } from "framer-motion";
import { HiOutlineArrowUp } from "react-icons/hi2";
import Magnetic from "./ui/Magnetic";
import { scrollToTopSmooth } from "../lib/lenis";

export default function Footer() {
  return (
    <footer className="relative border-t border-edge-soft py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 font-mono text-[11px] text-ink-dim sm:flex-row lg:px-12">
        <span>© {new Date().getFullYear()} Rehan Ahmad.</span>

        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-line rounded-full bg-signal-soft" />
          Available for new roles
        </span>

        <Magnetic
          as={motion.button}
          strength={0.5}
          data-cursor-hover
          onClick={scrollToTopSmooth}
          aria-label="Back to top"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-edge text-ink-dim transition-colors hover:border-signal/50 hover:text-signal-soft"
        >
          <HiOutlineArrowUp size={14} aria-hidden="true" />
        </Magnetic>
      </div>
    </footer>
  );
}
