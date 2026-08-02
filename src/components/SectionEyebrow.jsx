export default function SectionEyebrow({ number, label }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-signal-soft">
        {number}
        <span className="h-px w-10 bg-edge" />
      </span>
      <span className="font-mono text-[11px] tracking-[0.28em] text-ink-dim">
        {label}
      </span>
    </div>
  );
}
