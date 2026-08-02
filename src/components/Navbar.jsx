import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import Magnetic from "./ui/Magnetic";
import { scrollToSelector } from "../lib/lenis";

const MotionLink = motion(Link);

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

const sectionIds = ["top", ...links.map((l) => l.href.slice(1))];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The in-page section highlighter only means something on the home
  // page — clear it on any other route so the nav doesn't show a stale
  // "active" pill while reading a blog post.
  useEffect(() => {
    if (!isHome) setActive(null);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  // On the home page, an in-page link just scrolls (through Lenis). From
  // any other route, it's a real navigation to "/#section" — Link handles
  // that as a client-side route change, and Home.jsx picks up the hash on
  // mount and scrolls there once the layout has settled.
  const handleClick = (e, href) => {
    setOpen(false);
    if (!isHome) return;
    e.preventDefault();
    scrollToSelector(href);
  };

  const linkTarget = (href) => (isHome ? href : `/${href}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link
          to={isHome ? "#top" : "/"}
          onClick={(e) => handleClick(e, "#top")}
          className="group flex items-center gap-2.5"
          data-cursor-hover
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-soft opacity-40" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-signal-soft shadow-glow-sm" />
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight text-ink transition-colors group-hover:text-signal-soft">
            Rehan Ahmad
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className={`hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 md:flex ${
            scrolled ? "glass shadow-glow-sm" : ""
          }`}
        >
          {links.map((l) => {
            const isActive = isHome && active === l.href.slice(1);
            return (
              <Link
                key={l.href}
                to={linkTarget(l.href)}
                onClick={(e) => handleClick(e, l.href)}
                data-cursor-hover
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-full px-4 py-2 font-body text-[12.5px] font-medium uppercase tracking-wider transition-colors ${
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/[0.07]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <Magnetic
          as={MotionLink}
          strength={0.4}
          to={linkTarget("#contact")}
          onClick={(e) => handleClick(e, "#contact")}
          data-cursor-hover
          className="hidden items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-5 py-2 font-mono text-[12px] text-signal-soft transition-colors hover:bg-signal/20 md:flex"
        >
          let's talk <HiOutlineArrowUpRight className="text-[13px]" aria-hidden="true" />
        </Magnetic>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-2xl text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <HiOutlineX aria-hidden="true" /> : <HiOutlineMenu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass mx-4 mt-3 overflow-hidden rounded-2xl md:hidden"
          >
            <div className="flex flex-col p-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  to={linkTarget(l.href)}
                  onClick={(e) => handleClick(e, l.href)}
                  className="border-b border-edge-soft py-3.5 font-body text-sm font-medium uppercase tracking-wider text-ink-muted last:border-none hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to={linkTarget("#contact")}
                onClick={(e) => handleClick(e, "#contact")}
                className="mt-3 rounded-full border border-signal/40 bg-signal/10 px-5 py-2.5 text-center font-mono text-[12px] text-signal-soft"
              >
                let's talk →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
