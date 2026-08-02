import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SignalLine from "../components/SignalLine";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Blogs from "../components/Blogs";
import Contact from "../components/Contact";
import { scrollToSelector, scrollToTopInstant } from "../lib/lenis";
import { HOME_SECTIONS } from "../lib/sections";

export default function Home() {
  const location = useLocation();

  // Supports links like "/#contact" coming from another route (e.g. the
  // navbar, or a blog post's "View Project" button) — scroll to the
  // target section once we've landed on the home page and its layout has
  // settled. If there's no hash (e.g. arriving via "Back to portfolio"
  // from partway down a long article), reset to the top instead of
  // silently inheriting whatever scroll position the browser carried
  // over from the previous route.
  useEffect(() => {
    if (!location.hash) {
      scrollToTopInstant();
      return;
    }
    const raf = requestAnimationFrame(() => scrollToSelector(location.hash));
    return () => cancelAnimationFrame(raf);
  }, [location.hash]);

  return (
    <>
      <SignalLine sections={HOME_SECTIONS} />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Blogs />
      <Contact />
    </>
  );
}
