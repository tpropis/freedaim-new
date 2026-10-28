import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaxSeal from "@/components/declaration/WaxSeal";
import Ornament from "@/components/declaration/Ornament";
import { useInk } from "@/components/declaration/useInk";
import { gsap, reducedMotion, scrollToTop } from "@/lib/motion";

type IdeaForm = {
  idea: string;
  ideaName: string;
  problem: string;
  customer: string;
  stage: string;
  timeline: string;
  budget: string;
  email: string;
  name: string;
};

// Signed ideas go to Netlify Forms (form "whiteboard", declared statically in
// index.html so Netlify detects it at build). Submissions appear in the Netlify
// dashboard under Forms and can be emailed on arrival.
async function saveIdea(form: IdeaForm): Promise<void> {
  const body = new URLSearchParams({ "form-name": "whiteboard", "bot-field": "", agreed: "yes", ...form });
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Submission failed (${res.status})`);
}

const steps = [
  { title: "Submit your idea", desc: "Share what you're thinking." },
  { title: "AI feasibility review", desc: "We assess viability and market fit." },
  { title: "Execution roadmap", desc: "A clear plan to bring it to life." },
  { title: "We help you build it", desc: "From concept to launch, together." },
];

const STAGES = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "launched", label: "Launched" },
];

export default function Whiteboard() {
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<IdeaForm>({
    idea: "",
    ideaName: "",
    problem: "",
    customer: "",
    stage: "",
    timeline: "",
    budget: "",
    email: "",
    name: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  useInk(root);

  const update = (key: keyof IdeaForm, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const ready = form.idea.trim() && form.email.trim() && agreed;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      await saveIdea(form);
      setStatus("done");
      scrollToTop(false);
    } catch {
      // keep everything they wrote; let them try again
      setStatus("error");
    }
  };

  // the seal stamps down on the confirmation
  useGSAP(
    () => {
      if (status !== "done" || reducedMotion) return;
      gsap.fromTo(".wb-seal", { autoAlpha: 0, scale: 2.2, rotate: -50 }, { autoAlpha: 1, scale: 1, rotate: -10, duration: 0.55, ease: "back.out(2.2)", delay: 0.5 });
      gsap.fromTo(".wb-done", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.3 });
    },
    { dependencies: [status], scope: root }
  );

  return (
    <div ref={root} className="theme-paper min-h-screen">
      <Navbar tone="paper" />

      <main className="mx-auto max-w-[860px] px-5 pb-20 pt-32 md:pt-40">
        <header className="text-center">
          <p data-ink="fade" className="smallcaps text-ink-muted">
            Launchpad Collective <span className="text-ink-red">★</span> by freedaim
          </p>
          <h1 data-ink="press" className="mt-5 font-wood text-[clamp(3.4rem,10vw,7.6rem)] leading-[0.88] tracking-[0.01em]">
            The Whiteboard
          </h1>
          <p data-ink="wipe" className="mt-1 font-display text-[clamp(1.8rem,4vw,2.8rem)] italic text-ink-red">
            Sign the Declaration.
          </p>
          <p data-ink="fade" className="mx-auto mt-8 max-w-md font-caslon text-xl leading-[1.55] text-ink">
            Got an idea?
            <br />
            Write it down.
            <br />
            Let’s see if it can become reality.
          </p>
          <p data-ink="fade" className="mt-4 font-caslon italic text-ink-muted">
            Most people never build because they never start. Start here.
          </p>
        </header>

        {status === "done" ? (
          <div className="relative mt-16 border border-ink bg-paper-light px-8 py-20 text-center shadow-[6px_6px_0_rgba(23,20,15,0.12)]">
            <div className="wb-done">
              <p className="smallcaps text-ink-muted">Signed &amp; received</p>
              <h2 className="mt-4 font-display text-4xl">Idea received.</h2>
              <p className="mx-auto mt-4 max-w-md font-caslon text-lg text-ink-soft">
                If there is execution potential, we will reach out.
              </p>
              {form.name.trim() && <p className="mt-8 -rotate-3 font-sig text-5xl text-ink-blue">{form.name}</p>}
            </div>
            <div className="wb-seal absolute -right-6 -top-10">
              <WaxSeal size={120} />
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-16">
            {/* the whiteboard itself: write the idea in marker. Form controls are never
                hidden by scroll reveals, so keyboard users can always tab to them. */}
            <div className="rounded-[6px] bg-gradient-to-b from-[#C9CDD3] to-[#9CA2AB] p-[10px] shadow-[0_18px_40px_-22px_rgba(23,20,15,0.6)]">
              <div className="relative rounded-[2px] bg-[#FBFBF8]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.9), transparent 35%, rgba(255,255,255,0.55) 60%, transparent 82%)" }}
                />
                <textarea
                  value={form.idea}
                  onChange={(e) => update("idea", e.target.value)}
                  placeholder="Write your idea here…"
                  aria-label="Your idea"
                  required
                  className="relative min-h-[260px] w-full resize-none bg-transparent px-7 py-6 font-hand text-[28px] leading-[1.35] text-ink-blue placeholder:text-ink/30 focus:outline-none md:min-h-[300px] md:text-[32px]"
                />
              </div>
              <div className="mx-auto mt-[6px] h-[8px] w-1/3 rounded-full bg-[#8C929B]" aria-hidden="true" />
            </div>

            <Ornament />

            {/* the particulars, filled in like a printed form */}
            <fieldset className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
              <legend className="smallcaps mb-8 text-ink-muted">The Particulars</legend>
              <Line label="Idea name" required value={form.ideaName} onChange={(v) => update("ideaName", v)} placeholder="Give it a name" />
              <Line label="What problem does this solve?" required value={form.problem} onChange={(v) => update("problem", v)} placeholder="Describe the pain point" />
              <Line label="Who would pay for this?" required value={form.customer} onChange={(v) => update("customer", v)} placeholder="Target customer" />
              <div>
                <span className="smallcaps block text-[11px] text-ink-muted">
                  Stage <span className="text-ink-red">*</span>
                </span>
                <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Stage">
                  {STAGES.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      role="radio"
                      aria-checked={form.stage === s.value}
                      onClick={() => update("stage", s.value)}
                      className={`border-[1.5px] px-4 py-2 font-caslon text-sm transition-colors ${
                        form.stage === s.value ? "border-ink bg-ink text-paper-light" : "border-ink/40 text-ink hover:border-ink"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <Line label="Timeline goal" value={form.timeline} onChange={(v) => update("timeline", v)} placeholder="e.g. 3 months" />
              <Line label="Budget range" optional value={form.budget} onChange={(v) => update("budget", v)} placeholder="e.g. $5k – $20k" />
              <Line label="Email" required type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@company.com" />
            </fieldset>

            {/* the IP promise + agreement */}
            <section className="mt-14 border-y border-ink/25 py-8">
              <h3 className="font-display text-2xl">Your idea stays yours.</h3>
              <p className="mt-3 font-caslon leading-[1.6] text-ink-soft">
                Ideas submitted remain your intellectual property. Launchpad Collective only reviews concepts for potential execution
                partnerships. No idea is developed without permission.
              </p>
              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#B5242E]"
                />
                <span className="font-caslon text-[15px] leading-snug text-ink-soft">
                  I understand my idea remains my property and is only being reviewed for consulting purposes.
                </span>
              </label>
            </section>

            {/* the signature: typed name appears in hand */}
            <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <label className="block w-full max-w-[420px]">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Sign your name"
                  aria-label="Your name (signature)"
                  className="w-full -rotate-2 bg-transparent pl-2 font-sig text-[3.2rem] leading-[1] text-ink-blue placeholder:text-ink/25 focus:outline-none"
                />
                <span className="mt-1 block border-t border-ink pt-2 font-caslon text-[11px] uppercase tracking-[0.26em] text-ink-muted">
                  Signed — the founder <span className="normal-case tracking-normal">(optional)</span>
                </span>
              </label>
              <button type="submit" disabled={!ready || status === "sending"} className="btn-press justify-center disabled:cursor-not-allowed disabled:opacity-40">
                {status === "sending" ? "Sealing…" : "Sign & Submit"} <span aria-hidden="true">→</span>
              </button>
            </div>
            {!ready && (
              <p className="mt-4 text-right font-caslon text-sm italic text-ink-muted">
                Write your idea, add your email, and agree above to sign.
              </p>
            )}
            {status === "error" && (
              <p role="alert" className="mt-4 text-right font-caslon text-sm text-ink-red">
                That didn’t go through — nothing you wrote was lost. Please try again in a moment.
              </p>
            )}
          </form>
        )}

        {/* How this works */}
        <section className="mt-24">
          <p className="smallcaps text-center text-ink-muted">How This Works</p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} data-ink="fade" className="border-t-2 border-ink pt-4">
                <span className="font-caslon text-sm font-bold text-ink-red">{["I", "II", "III", "IV"][i]}.</span>
                <h3 className="mt-2 font-display text-xl leading-tight">{s.title}</h3>
                <p className="mt-2 font-caslon text-[15px] leading-[1.5] text-ink-soft">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer tone="paper" />
    </div>
  );
}

function Line({
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="smallcaps block text-[11px] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-ink-red">*</span>}
        {optional && <span className="ml-2 normal-case tracking-normal text-ink-muted/70">optional</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-ink/40 bg-transparent py-2 font-caslon text-lg text-ink placeholder:italic placeholder:text-ink/30 focus:border-ink-red focus:outline-none"
      />
    </label>
  );
}
