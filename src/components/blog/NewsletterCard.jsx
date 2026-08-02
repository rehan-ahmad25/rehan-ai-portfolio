import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane, HiOutlineCheck } from "react-icons/hi2";
import AmbientBlobs from "../ui/AmbientBlobs";

// UI only, as requested — there's no backend wired up, so submitting just
// shows a confirmation state locally rather than pretending to send
// anything anywhere.
export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-8 text-center md:p-10">
      <AmbientBlobs variant="purple" />
      <div className="relative">
        <span className="eyebrow font-mono text-[11px] uppercase tracking-widest text-violet-soft">
          Newsletter
        </span>
        <h3 className="mt-3 font-display text-2xl font-normal text-ink">
          New articles, occasionally.
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
          No spam, no schedule — just a note when something new is worth
          reading.
        </p>

        {submitted ? (
          <div className="mt-6 flex items-center justify-center gap-2 font-mono text-sm text-signal-soft">
            <HiOutlineCheck aria-hidden="true" /> You're on the list.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-edge bg-surface-2/60 px-4 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink-dim focus:border-violet/50 focus:shadow-glow-violet"
            />
            <motion.button
              type="submit"
              data-cursor-hover
              whileHover={{ y: -2 }}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-violet px-5 py-2.5 font-mono text-[12.5px] text-void shadow-glow-violet transition-shadow"
            >
              Subscribe <HiOutlinePaperAirplane aria-hidden="true" className="rotate-45" />
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
