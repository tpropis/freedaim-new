// A printer's section break: double rules either side of a red star.
export default function Ornament() {
  return (
    <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-5 text-ink-red md:px-10" aria-hidden="true">
      <span className="double-rule flex-1 opacity-60" />
      <span className="text-sm tracking-[0.5em]">★</span>
      <span className="double-rule flex-1 opacity-60" />
    </div>
  );
}
