import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import data from "@/data/people.json";

type Person = {
  id: number;
  file: string;
  name: string;
  category: string;
  blurb: string;
  url: string;
};

const OVERRIDES: Record<number, Partial<Person>> = {
  82: { blurb: "I married Hillary — do you blame me?" },
  81: { blurb: "Bill made me famous." },
  33: {
    blurb:
      "Electric dual-threat QUARTERBACK who could escape any pocket — except the federal one. WWJD? Probably not 7-on-7 with the kennel. Honestly… I should've been the one on the leash.",
  },
  34: {
    blurb:
      "[trembling behind the corner] …i-i'm a good boy. i swear. i just wanted a couch, a Kong, and to never hear a garage door open at 2 a.m. again. please don't make me go back in the ring.",
  },
  51: {
    blurb:
      "Striped-shirt fugitive, beanie enthusiast, master of crowds. Last confirmed sighting: somewhere in this paragraph.",
  },
  137: {
    blurb:
      "Sports Illustrated, 1999: \"Imagine having to take the [7] train to [Shea Stadium] looking like you're [riding through] Beirut next to some kid with purple hair, next to some queer with AIDS, next to some dude who just got out of jail for the fourth time, next to some 20-year-old mom with four kids. It's depressing.\" Career ERA after that interview: undefined.",
  },
  118: undefined,
  107: { blurb: "CTRL + Z" },
};

const ADJACENT_AFTER: Record<number, number> = {
  82: 81,
  118: 107,
};

const rawPeople = (data as { people: Person[] }).people.map((p) => ({
  ...p,
  ...(OVERRIDES[p.id] ?? {}),
}));

const sorted = [...rawPeople].sort((a, b) => a.file.localeCompare(b.file));
const PEOPLE: Person[] = (() => {
  const list = [...sorted];
  for (const [anchorIdStr, moveIdStr] of Object.entries(ADJACENT_AFTER)) {
    const anchorId = Number(anchorIdStr);
    const moveId = Number(moveIdStr);
    const moveIdx = list.findIndex((p) => p.id === moveId);
    if (moveIdx === -1) continue;
    const [moved] = list.splice(moveIdx, 1);
    const anchorIdx = list.findIndex((p) => p.id === anchorId);
    if (anchorIdx === -1) list.push(moved);
    else list.splice(anchorIdx + 1, 0, moved);
  }
  return list;
})();

const TOMMY_ID = 192;
const BIDEN_ID = 189;
const PITBULL_ID = 34;
const CAITLYN_ID = 107;
const BRUCE_ID = 118;
const WALDO_ID = 51;
const HEFNER_ID = 74;
const BOMB_ID = 121;
const BRUCE_URL = PEOPLE.find((p) => p.id === BRUCE_ID)?.url ?? "";
const BOMB_INDEX = PEOPLE.findIndex((p) => p.id === BOMB_ID);

export default function IconicAmericans() {
  const [params, setParams] = useSearchParams();
  const activeIdParam = params.get("p");
  const activeId = activeIdParam ? Number(activeIdParam) : null;

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            if (v === null || v === "") next.delete(k);
            else next.set(k, v);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const activeIndex = activeId ? PEOPLE.findIndex((p) => p.id === activeId) : -1;
  const active = activeIndex >= 0 ? PEOPLE[activeIndex] : null;

  const close = useCallback(() => update({ p: null }), [update]);
  const open = useCallback((id: number) => update({ p: String(id) }), [update]);
  const step = useCallback(
    (dir: number) => {
      if (activeIndex < 0) return;
      const next = (activeIndex + dir + PEOPLE.length) % PEOPLE.length;
      update({ p: String(PEOPLE[next].id) });
    },
    [activeIndex, update]
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, step]);

  // Bomb explosion state
  const [exploded, setExploded] = useState(false);
  const bombTimer = useRef<number | null>(null);
  const resetTimer = useRef<number | null>(null);

  const onBombEnter = useCallback(() => {
    if (exploded) return;
    if (bombTimer.current) window.clearTimeout(bombTimer.current);
    bombTimer.current = window.setTimeout(() => {
      setExploded(true);
      resetTimer.current = window.setTimeout(() => setExploded(false), 2600);
    }, 6000);
  }, [exploded]);

  const onBombLeave = useCallback(() => {
    if (exploded) return;
    if (bombTimer.current) {
      window.clearTimeout(bombTimer.current);
      bombTimer.current = null;
    }
  }, [exploded]);

  useEffect(() => () => {
    if (bombTimer.current) window.clearTimeout(bombTimer.current);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  const isTommy = active?.id === TOMMY_ID;
  const isBiden = active?.id === BIDEN_ID;
  const isWaldo = active?.id === WALDO_ID;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto max-w-7xl px-4 pt-16 pb-10 text-center lg:px-8">
        <h1
          className="text-6xl leading-none text-foreground md:text-8xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          TWO HUNDRED &amp; FIFTY
        </h1>
        <p
          className="mt-4 text-xs uppercase text-muted-foreground md:text-sm"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.3em" }}
        >
          250 icons crammed into 50 states{" "}
          <span className="text-crimson">
            + canada &amp; greenland (our 51st &amp; 52nd, paperwork pending)
          </span>
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <div
          className={`grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-14 ${
            exploded ? "[animation:screen-shake_0.6s_ease-in-out]" : ""
          }`}
        >
          {PEOPLE.map((p, idx) => {
            const biden = p.id === BIDEN_ID;
            const pit = p.id === PITBULL_ID;
            const caitlyn = p.id === CAITLYN_ID;
            const waldo = p.id === WALDO_ID;
            const hefner = p.id === HEFNER_ID;
            const bomb = p.id === BOMB_ID;

            // Blast wave distance from bomb in flat index
            const dist = BOMB_INDEX >= 0 ? Math.abs(idx - BOMB_INDEX) : 999;
            const inBlast = exploded && dist > 0 && dist <= 8;
            const isBombSelf = exploded && bomb;
            const blastDelay = `${dist * 70}ms`;

            const imgClass = biden
              ? "h-full w-full object-cover grayscale rotate-180 transition-all duration-700 group-hover:grayscale-0 group-hover:[animation:biden-spin_1.4s_ease-in-out]"
              : pit
              ? "h-full w-full object-cover grayscale transition-all duration-200 group-hover:grayscale-0 group-hover:[animation:pit-cower_0.5s_ease-in-out_infinite]"
              : caitlyn
              ? "h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
              : waldo
              ? "h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-0 group-hover:scale-90"
              : "h-full w-full object-cover grayscale transition-all duration-200 group-hover:grayscale-0";

            const tileExtra = isBombSelf
              ? " [animation:bomb-blast_1.2s_ease-out_forwards]"
              : inBlast
              ? " [animation:tile-blow_1.4s_ease-out_forwards]"
              : "";

            return (
              <button
                key={p.id}
                onClick={() => open(p.id)}
                onMouseEnter={bomb ? onBombEnter : undefined}
                onMouseLeave={bomb ? onBombLeave : undefined}
                title={waldo ? "where's…?" : p.name}
                style={inBlast || isBombSelf ? { animationDelay: blastDelay } : undefined}
                className={`group relative aspect-square overflow-hidden rounded-md bg-card outline-none transition-transform duration-200 hover:z-10 hover:scale-110 hover:shadow-[0_0_24px_rgba(212,58,78,0.55)] focus-visible:scale-110${tileExtra}`}
              >
                <img src={p.url} alt={p.name} loading="lazy" className={imgClass} />

                {caitlyn && BRUCE_URL && (
                  <>
                    <img
                      src={BRUCE_URL}
                      alt="Bruce Jenner"
                      aria-hidden
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 group-hover:[animation:bruce-flash_1.8s_ease-in-out_forwards]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:[animation:edit-undo-text_1.8s_ease-in-out_forwards] [text-shadow:0_2px_8px_rgba(0,0,0,0.95)]">
                      EDIT · UNDO!
                    </span>
                  </>
                )}

                {biden && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
                    Zzz
                  </span>
                )}

                {pit && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-1 text-center text-[10px] font-black uppercase tracking-widest text-red-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 [text-shadow:0_1px_4px_rgba(0,0,0,0.95)]">
                    please don't
                  </span>
                )}

                {waldo && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600/30 to-white/10 text-3xl font-black text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
                    ?
                  </span>
                )}

                {hefner && (
                  <>
                    {/* Theater curtains — open on hover to reveal Hef */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 origin-left transition-transform duration-700 ease-out group-hover:-translate-x-full"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, #6b0f1a 0 8px, #4a0a12 8px 14px, #8a1424 14px 22px)",
                        boxShadow: "inset -8px 0 16px rgba(0,0,0,0.6)",
                      }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-0 w-1/2 origin-right transition-transform duration-700 ease-out group-hover:translate-x-full"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, #6b0f1a 0 8px, #4a0a12 8px 14px, #8a1424 14px 22px)",
                        boxShadow: "inset 8px 0 16px rgba(0,0,0,0.6)",
                      }}
                    />
                    {/* Curtain valance on top */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-4"
                      style={{
                        background:
                          "linear-gradient(180deg, #2a0509, #6b0f1a 70%, rgba(0,0,0,0))",
                      }}
                    />
                    {/* Smoke puffs (visible after curtain opens) */}
                    <span aria-hidden className="pointer-events-none absolute left-[58%] top-[55%] h-2 w-2 rounded-full bg-white/80 opacity-0 blur-[2px] group-hover:[animation:smoke-puff_1.6s_ease-out_0.6s_infinite]" />
                    <span aria-hidden className="pointer-events-none absolute left-[62%] top-[55%] h-1.5 w-1.5 rounded-full bg-white/70 opacity-0 blur-[2px] group-hover:[animation:smoke-puff_1.6s_ease-out_1s_infinite]" />
                    <span aria-hidden className="pointer-events-none absolute left-[55%] top-[55%] h-2.5 w-2.5 rounded-full bg-white/60 opacity-0 blur-[3px] group-hover:[animation:smoke-puff_1.8s_ease-out_1.4s_infinite]" />
                  </>
                )}

                {bomb && (
                  <>
                    {/* Fuse spark while hovering (pre-boom) */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full bg-yellow-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:[animation:fuse-spark_0.4s_ease-in-out_infinite]"
                      style={{ boxShadow: "0 0 12px 4px rgba(255,200,0,0.9)" }}
                    />
                    {isBombSelf && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 bg-gradient-radial from-yellow-200 via-orange-500 to-red-700 [animation:fireball_1s_ease-out_forwards]"
                        style={{
                          background:
                            "radial-gradient(circle, #fff7d0 0%, #ffb347 30%, #ff4500 60%, rgba(120,0,0,0) 80%)",
                        }}
                      />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <style>{`
        @keyframes biden-spin {
          0% { transform: rotate(180deg); }
          50% { transform: rotate(540deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pit-cower {
          0%, 100% { transform: translate(0, 2px) scale(0.94); }
          25% { transform: translate(-1px, 3px) scale(0.93) rotate(-1deg); }
          50% { transform: translate(1px, 2px) scale(0.94) rotate(0.5deg); }
          75% { transform: translate(-1px, 3px) scale(0.93) rotate(-0.5deg); }
        }
        @keyframes bruce-flash {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          55%  { opacity: 1; }
          75%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes edit-undo-text {
          0%, 60% { opacity: 0; transform: scale(0.9); }
          70%     { opacity: 1; transform: scale(1.08); }
          100%    { opacity: 1; transform: scale(1); }
        }
        @keyframes robe-drop {
          0%   { transform: translateY(0)   rotate(0);   opacity: 0.9; }
          40%  { transform: translateY(20%) rotate(-3deg); opacity: 0.85; }
          100% { transform: translateY(120%) rotate(-10deg); opacity: 0; }
        }
        @keyframes smoke-puff {
          0%   { opacity: 0; transform: translate(0, 0)    scale(0.6); }
          30%  { opacity: 0.85; }
          100% { opacity: 0; transform: translate(-8px, -28px) scale(2.2); }
        }
        @keyframes fuse-spark {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.6); opacity: 0.6; }
        }
        @keyframes fireball {
          0%   { transform: scale(0.2); opacity: 0; }
          25%  { transform: scale(1.3); opacity: 1; }
          70%  { transform: scale(2.2); opacity: 0.9; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes bomb-blast {
          0%   { transform: scale(1) rotate(0); filter: brightness(1); }
          20%  { transform: scale(1.4) rotate(4deg); filter: brightness(3); }
          60%  { transform: scale(0.6) rotate(-6deg); filter: brightness(0.4); opacity: 0.5; }
          100% { transform: scale(0) rotate(0); opacity: 0; }
        }
        @keyframes tile-blow {
          0%   { transform: translate(0,0) rotate(0) scale(1); opacity: 1; }
          30%  { transform: translate(var(--bx,8px), var(--by,-12px)) rotate(8deg) scale(1.05); filter: brightness(1.8); }
          100% { transform: translate(calc(var(--bx,8px) * 4), calc(var(--by,-12px) * 4)) rotate(35deg) scale(0.2); opacity: 0; }
        }
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          15% { transform: translate(-6px, 4px); }
          30% { transform: translate(7px, -3px); }
          45% { transform: translate(-5px, -5px); }
          60% { transform: translate(4px, 6px); }
          75% { transform: translate(-3px, 2px); }
        }
      `}</style>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/70 p-2 text-foreground transition-colors hover:bg-card md:left-8"
              aria-label="Previous"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card/70 p-2 text-foreground transition-colors hover:bg-card md:right-8"
              aria-label="Next"
            >
              <ChevronRight size={22} />
            </button>

            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <button
                onClick={close}
                className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {isWaldo ? (
                <WaldoFullPuzzle person={active} />
              ) : (
                <>
                  <div className="flex max-h-[55vh] w-full shrink-0 items-center justify-center bg-black">
                    <img
                      src={active.url}
                      alt={active.name}
                      className={`max-h-[55vh] w-full object-contain ${isBiden ? "rotate-180" : ""}`}
                    />
                  </div>
                  <div className="space-y-3 overflow-y-auto p-5 text-center md:p-6">
                    <p
                      className="text-xs uppercase text-crimson"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.35em" }}
                    >
                      {active.category}
                    </p>
                    <p
                      className="text-2xl text-foreground md:text-3xl"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
                    >
                      {isTommy ? "THE GUY NAMED TOMMY" : active.name.toUpperCase()}
                    </p>
                    {isTommy ? (
                      <>
                        <p
                          className="select-none text-sm leading-relaxed text-muted-foreground blur-sm transition-all duration-200 hover:blur-0"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          [CLASSIFIED // ACCESS RESTRICTED] Subject file sealed under
                          executive order. Biographical data, known affiliations, and
                          operational history withheld pending clearance review.
                          Unauthorized disclosure prohibited.
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-crimson/80">
                          level 13 clearance required
                        </p>
                      </>
                    ) : isBiden ? (
                      <p
                        className="text-lg leading-relaxed text-muted-foreground"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        Zzzzzzzzzzzzzzzzzzzzzz
                      </p>
                    ) : (
                      <p
                        className="text-sm leading-relaxed text-muted-foreground"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {active.blurb}
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Where's Waldo Scene Puzzle ---------- */

type Crowdee = {
  id: number;
  x: number;
  y: number;
  scale: number;
  shirt: string;
  pants: string;
  hat: string | null;
  skin: string;
  hasGlasses: boolean;
  isWaldo: boolean;
};

const SHIRTS = ["#1e63b8", "#0f9d58", "#f5a623", "#7b3fa0", "#e94e3c", "#16a085", "#d35400", "#34495e", "#c0392b"];
const PANTS = ["#222", "#3b2a1a", "#1f3a5f", "#4b3621", "#2d2d2d"];
const HATS = ["#000", "#1e63b8", "#0f9d58", "#f5a623", "#7b3fa0", null, null, null];
const SKINS = ["#f4c9a8", "#d9a37a", "#a87149", "#6e4427", "#3b2412"];

function seeded(n: number) {
  // tiny deterministic PRNG so a "seed" reshuffle is reproducible within a render
  let s = n + 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function makeCrowd(seed: number): Crowdee[] {
  const rng = seeded(seed);
  const cols = 14;
  const rows = 12;
  const out: Crowdee[] = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // skip a few to vary density
      if (rng() < 0.06) continue;
      const jitterX = (rng() - 0.5) * 5.5;
      const jitterY = (rng() - 0.5) * 4.5;
      out.push({
        id: id++,
        x: (c + 0.5) * (100 / cols) + jitterX,
        y: (r + 0.5) * (100 / rows) + jitterY,
        scale: 0.85 + rng() * 0.4,
        shirt: SHIRTS[Math.floor(rng() * SHIRTS.length)],
        pants: PANTS[Math.floor(rng() * PANTS.length)],
        hat: HATS[Math.floor(rng() * HATS.length)],
        skin: SKINS[Math.floor(rng() * SKINS.length)],
        hasGlasses: rng() < 0.18,
        isWaldo: false,
      });
    }
  }
  // pick a Waldo somewhere away from the corners
  const candidates = out.filter((p) => p.x > 12 && p.x < 88 && p.y > 12 && p.y < 88);
  const waldo = candidates[Math.floor(rng() * candidates.length)];
  if (waldo) {
    waldo.isWaldo = true;
    waldo.shirt = "WALDO";
    waldo.pants = "#1e3a8a";
    waldo.hat = "WALDO";
    waldo.hasGlasses = true;
    waldo.skin = "#f4c9a8";
  }
  return out;
}

function Figure({ p }: { p: Crowdee }) {
  const stripeId = `stripes-${p.id}`;
  const isWaldoShirt = p.shirt === "WALDO";
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${p.scale * 0.05})`}>
      {isWaldoShirt && (
        <defs>
          <pattern id={stripeId} width="2" height="2" patternUnits="userSpaceOnUse">
            <rect width="2" height="2" fill="#ffffff" />
            <rect width="2" height="1" fill="#dc2626" />
          </pattern>
        </defs>
      )}
      {/* legs / pants */}
      <rect x="-5" y="6" width="4" height="10" fill={p.pants} />
      <rect x="1" y="6" width="4" height="10" fill={p.pants} />
      {/* shirt / torso */}
      <rect x="-7" y="-4" width="14" height="11" fill={isWaldoShirt ? `url(#${stripeId})` : p.shirt} />
      {/* arms */}
      <rect x="-9" y="-3" width="2" height="9" fill={isWaldoShirt ? `url(#${stripeId})` : p.shirt} />
      <rect x="7" y="-3" width="2" height="9" fill={isWaldoShirt ? `url(#${stripeId})` : p.shirt} />
      {/* head */}
      <circle cx="0" cy="-9" r="5" fill={p.skin} />
      {/* hat */}
      {p.hat === "WALDO" ? (
        <>
          <ellipse cx="0" cy="-13.5" rx="6" ry="1.4" fill="#dc2626" />
          <rect x="-3.5" y="-17" width="7" height="4" fill="#dc2626" />
          <rect x="-3.5" y="-15.5" width="7" height="1.5" fill="#ffffff" />
          <circle cx="0" cy="-18" r="1.2" fill="#ffffff" />
        </>
      ) : p.hat ? (
        <rect x="-4" y="-15" width="8" height="3" fill={p.hat} />
      ) : null}
      {/* glasses */}
      {p.hasGlasses && (
        <>
          <circle cx="-1.8" cy="-9" r="1.6" fill="none" stroke="#111" strokeWidth="0.5" />
          <circle cx="1.8" cy="-9" r="1.6" fill="none" stroke="#111" strokeWidth="0.5" />
          <line x1="-0.2" y1="-9" x2="0.2" y2="-9" stroke="#111" strokeWidth="0.5" />
        </>
      )}
    </g>
  );
}

function WaldoFullPuzzle({ person }: { person: Person }) {
  const [found, setFound] = useState(false);
  const [missed, setMissed] = useState(0);
  const [shake, setShake] = useState(false);
  const [seed, setSeed] = useState(1);

  const crowd = useMemo(() => makeCrowd(seed), [seed]);

  const onPick = (isWaldo: boolean) => {
    if (found) return;
    if (isWaldo) {
      setFound(true);
    } else {
      setMissed((m) => m + 1);
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
  };

  if (found) {
    return (
      <>
        <div className="flex max-h-[55vh] w-full shrink-0 items-center justify-center bg-black">
          <img src={person.url} alt={person.name} className="max-h-[55vh] w-full object-contain" />
        </div>
        <div className="space-y-3 overflow-y-auto p-5 text-center md:p-6">
          <p
            className="text-xs uppercase text-crimson"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.35em" }}
          >
            ★ FOUND HIM ★ · {person.category}
          </p>
          <p
            className="text-2xl text-foreground md:text-3xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            {person.name.toUpperCase()}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            {person.blurb}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex max-h-[92vh] flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-red-600 px-5 py-3 text-white">
        <p
          className="text-2xl"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.15em" }}
        >
          WHERE'S WALDO?
        </p>
        <p className="text-[11px] uppercase tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          misses: <span className="font-bold">{missed}</span>
        </p>
      </div>

      <div
        className={`flex-1 overflow-auto bg-[#f5e9c8] p-2 ${
          shake ? "[animation:pit-cower_0.3s_ease-in-out]" : ""
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto block h-full max-h-[60vh] w-full"
          style={{
            background:
              "repeating-linear-gradient(45deg, #f5e9c8 0 6px, #efe0b5 6px 12px)",
          }}
        >
          {/* a few scene props for flavor */}
          <rect x="0" y="92" width="100" height="8" fill="#c9b27a" />
          {crowd.map((p) => (
            <g
              key={p.id}
              onClick={() => onPick(p.isWaldo)}
              style={{ cursor: "pointer" }}
              className="transition-transform hover:[transform-origin:center] hover:scale-110"
            >
              <Figure p={p} />
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80">
          red &amp; white stripes · beanie · round glasses
        </p>
        <button
          type="button"
          onClick={() => { setSeed((s) => s + 1); setMissed(0); }}
          className="rounded-sm border border-border bg-card/60 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          ↻ Shuffle
        </button>
      </div>
    </div>
  );
}

