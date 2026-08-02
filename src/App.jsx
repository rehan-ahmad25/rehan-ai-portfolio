import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenis from "./lib/useLenis";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Code-split: react-markdown, remark-gfm, rehype-slug, and the syntax
// highlighter are real bundle weight that only a visitor actually reading
// a blog post needs to pay for — keeping them out of the home page's
// initial chunk matters more here than almost anywhere else in the app.
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

const VISITED_KEY = "rehan-portfolio-visited";

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <span className="h-2 w-2 animate-pulse-line rounded-full bg-signal-soft" />
    </div>
  );
}

export default function App() {
  // Only play the loading intro once per browser session — a returning
  // visitor (or someone hitting refresh while reviewing the site) shouldn't
  // have to sit through it again. App stays mounted across client-side
  // route changes (only the matched <Route> swaps), so this never replays
  // when navigating between the home page and a blog post either.
  const [loading, setLoading] = useState(() => {
    try {
      return sessionStorage.getItem(VISITED_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const contentRef = useRef(null);
  useLenis();

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  // `aria-hidden` alone doesn't stop keyboard focus from landing on
  // elements visually covered by the preloader overlay. `inert` does —
  // toggled imperatively since not every React 18 render target reliably
  // maps a boolean `inert` prop to the DOM attribute the way `disabled` is.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (loading) el.setAttribute("inert", "");
    else el.removeAttribute("inert");
  }, [loading]);

  const handlePreloaderDone = () => {
    setLoading(false);
    try {
      sessionStorage.setItem(VISITED_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode / disabled) — non-fatal,
      // the intro just replays next load.
    }
    // Unlocking body scroll can reintroduce a scrollbar (on platforms that
    // don't overlay it), nudging layout by a few pixels — recalculate
    // ScrollTrigger's cached positions once that settles.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {loading && <Preloader onDone={handlePreloaderDone} />}

      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: loading ? 0 : 0.1 }}
        className="relative"
      >
        <CustomCursor />
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </motion.div>
    </>
  );
}
