/**
 * Two slow-drifting, blurred gradient orbs used behind section content to
 * add depth without competing with the foreground. Purely decorative —
 * aria-hidden and pointer-events disabled.
 */
export default function AmbientBlobs({ variant = "default" }) {
  const palettes = {
    default: ["#4C8DFF", "#7CE7E1"],
    violet: ["#4C8DFF", "#7A5CFF"],
    cyan: ["#7CE7E1", "#4C8DFF"],
  };
  const [a, b] = palettes[variant] || palettes.default;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="blob animate-drift-a"
        style={{
          width: 420,
          height: 420,
          top: "-8%",
          left: "-6%",
          background: a,
          opacity: 0.14,
        }}
      />
      <div
        className="blob animate-drift-b"
        style={{
          width: 360,
          height: 360,
          bottom: "-10%",
          right: "-4%",
          background: b,
          opacity: 0.12,
        }}
      />
    </div>
  );
}
