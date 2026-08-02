import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineArrowUpRight,
  HiOutlinePaperAirplane,
  HiOutlineClipboard,
  HiOutlineCheck,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import SectionEyebrow from "./SectionEyebrow";
import TiltCard from "./ui/TiltCard";
import Magnetic from "./ui/Magnetic";
import AmbientBlobs from "./ui/AmbientBlobs";
import { fadeUp } from "../lib/motion";

const EMAIL = "m.rehanahmad25@gmail.com";

// Read from a Vite env var so the real endpoint never has to be hardcoded
// into the repo — see .env.example.
const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

const contactLinks = [
  {
    icon: FaGithub,
    label: "GitHub",
    value: "github.com/rehanahmad",
    href: "https://github.com/rehan-ahmad25",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/rehanahmad",
    href: "https://www.linkedin.com/in/rehan-ahmad-5416773b8/",
  },
  {
    icon: HiOutlineMail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  // idle | submitting | success | error
  const [status, setStatus] = useState("idle");
  // Snapshot of what was actually submitted, kept around for the success
  // screen's recap — the live `form` state gets cleared on success per the
  // "reset the form" requirement, so the confirmation view can't read from
  // `form` directly once that happens.
  const [submitted, setSubmitted] = useState({ name: "", email: "", message: "" });
  const [copied, setCopied] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!FORMSPREE_ENDPOINT) {
      // Missing/unset env var — fail fast with a clear signal instead of
      // letting fetch() throw an opaque error against an "undefined" URL.
      console.error(
        "VITE_FORMSPREE_ENDPOINT is not set. Copy .env.example to .env and add your Formspree endpoint."
      );
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Formspree responded with ${response.status}`);
      }

      setSubmitted(form);
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
    }
  };

  const handleCopy = async () => {
    const text = `From: ${submitted.name} (${submitted.email})\n\n${submitted.message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — non-fatal, nothing else depends on it.
    }
  };

  const isSubmitting = status === "submitting";

  return (
    <section id="contact" className="relative overflow-hidden py-32 lg:py-44">
      <AmbientBlobs variant="violet" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16"
        >
          <SectionEyebrow number="06" label="CONTACT" />
          <h2 className="max-w-2xl font-display text-4xl font-normal leading-[1.15] md:text-5xl">
            Building something ambitious with AI?{" "}
            <span className="text-gradient italic">Let's talk.</span>
          </h2>
          <p className="mt-5 max-w-md text-ink-muted">
            Open to AI/ML developer roles, internships, and select
            collaborations. Usually replies within a day.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-4 lg:col-span-4"
          >
            {contactLinks.map(({ icon: Icon, label, value, href }) => (
              <TiltCard
                as={motion.a}
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-cursor-hover
                tiltStrength={5}
                className="glow-border sheen glass group flex items-center gap-4 rounded-2xl p-5 transition-colors duration-300 hover:border-signal/30"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-edge text-ink-muted transition-all duration-300 group-hover:scale-110 group-hover:border-signal/50 group-hover:text-signal-soft">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span className="flex-1 overflow-hidden">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                    {label}
                  </span>
                  <span className="block truncate text-sm text-ink">{value}</span>
                </span>
                <HiOutlineArrowUpRight
                  aria-hidden="true"
                  className="shrink-0 text-ink-dim transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-soft"
                />
              </TiltCard>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ delay: 0.08 }}
            className="glass sheen relative overflow-hidden rounded-3xl p-7 lg:col-span-8 lg:p-10"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal/15 blur-[90px]" />

            <div role="status" aria-live="polite" className="relative">
              <AnimatePresence mode="wait">
                {status !== "success" ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        disabled={isSubmitting}
                      />
                      <Field
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        required
                        disabled={isSubmitting}
                      />
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="contact-message"
                          className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-dim"
                        >
                          Message
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          required
                          disabled={isSubmitting}
                          placeholder="Tell me about the role or project..."
                          className="w-full resize-none rounded-2xl border border-edge bg-surface-2/60 px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink-dim focus:border-signal/50 focus:shadow-glow-sm disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-start gap-3 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3.5">
                            <HiOutlineExclamationTriangle
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-amber"
                            />
                            <p className="text-sm leading-relaxed text-ink-muted">
                              Something went wrong sending that -- your
                              message wasn't lost, nothing here was cleared.
                              Please try again, or email{" "}
                              <a
                                href={`mailto:${EMAIL}`}
                                className="text-ink underline decoration-amber/50 underline-offset-2 hover:text-amber"
                              >
                                {EMAIL}
                              </a>{" "}
                              directly.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Magnetic
                      as={motion.button}
                      strength={isSubmitting ? 0 : 0.3}
                      type="submit"
                      disabled={isSubmitting}
                      data-cursor-hover
                      className="relative mt-6 flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 font-mono text-[13px] text-void shadow-glow transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(76,141,255,0.5)] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <HiOutlineArrowPath
                            aria-hidden="true"
                            className="animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send message
                          <HiOutlinePaperAirplane
                            aria-hidden="true"
                            className="rotate-45 transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </>
                      )}
                    </Magnetic>
                  </motion.form>
                ) : (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-lg text-ink">
                      Thanks! Your message has been sent successfully. I'll
                      get back to you as soon as possible.
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                      Here's a copy of what was sent, for your records.
                    </p>

                    <pre className="mt-5 whitespace-pre-wrap break-words rounded-2xl border border-edge bg-surface-2/60 p-4 font-mono text-[12.5px] leading-relaxed text-ink-muted">
{`From: ${submitted.name} <${submitted.email}>

${submitted.message}`}
                    </pre>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleCopy}
                        data-cursor-hover
                        className="flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 font-mono text-[12.5px] text-ink transition-colors hover:border-signal/50 hover:bg-white/5"
                      >
                        {copied ? (
                          <>
                            <HiOutlineCheck aria-hidden="true" className="text-signal-soft" /> Copied
                          </>
                        ) : (
                          <>
                            <HiOutlineClipboard aria-hidden="true" /> Copy message
                          </>
                        )}
                      </button>
                      <a
                        href={`mailto:${EMAIL}`}
                        data-cursor-hover
                        className="flex items-center gap-2 rounded-full border border-edge px-5 py-2.5 font-mono text-[12.5px] text-ink transition-colors hover:border-signal/50 hover:bg-white/5"
                      >
                        <HiOutlineMail aria-hidden="true" /> Email directly
                      </a>
                      <button
                        type="button"
                        onClick={() => setStatus("idle")}
                        data-cursor-hover
                        className="flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[12.5px] text-ink-dim transition-colors hover:text-ink"
                      >
                        <HiOutlineArrowPath aria-hidden="true" /> Send another message
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  disabled,
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink-dim">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-2xl border border-edge bg-surface-2/60 px-4 py-3.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-ink-dim focus:border-signal/50 focus:shadow-glow-sm disabled:opacity-60"
      />
    </div>
  );
}