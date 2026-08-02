import { useState } from "react";
import { FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { HiOutlineLink, HiOutlineCheck } from "react-icons/hi2";

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? url || window.location.href : url;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing to fall back to here, the
      // visitor can still select the URL from the address bar.
    }
  };

  const links = [
    {
      label: "Share on X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Share on LinkedIn",
      icon: FaLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-edge text-ink-dim transition-colors hover:border-signal/50 hover:text-signal-soft"
        >
          <Icon size={14} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={handleCopy}
        data-cursor-hover
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-edge text-ink-dim transition-colors hover:border-signal/50 hover:text-signal-soft"
      >
        {copied ? (
          <HiOutlineCheck size={14} aria-hidden="true" className="text-signal-soft" />
        ) : (
          <HiOutlineLink size={14} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
