import { HiOutlineUser } from "react-icons/hi2";

export default function AuthorCard() {
  return (
    <div className="flex items-center gap-3.5">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-edge bg-surface-2">
        <HiOutlineUser
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-ink-dim"
        />
        <img
          src="/rehan.png"
          alt=""
          className="relative h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </span>
      <div>
        <div className="text-sm text-ink">Rehan Ahmad</div>
        <div className="font-mono text-[11px] text-ink-dim">
          AI Developer · Machine Learning Developer
        </div>
      </div>
    </div>
  );
}
