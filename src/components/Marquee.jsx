import { marqueeItems } from "../data/experience";

export default function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems];
  return (
    <div
      aria-hidden="true"
      className="group relative border-y border-edge-soft bg-surface/40 py-6"
    >
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10 [animation-play-state:running] group-hover:[animation-play-state:paused]">
          {doubled.map((item, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10">
              <span
                className="cursor-default font-mono text-sm tracking-wide text-ink-dim transition-all duration-300 hover:text-signal-soft"
              >
                {item}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-signal/60 transition-transform duration-300 hover:scale-[2.5]" />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}
