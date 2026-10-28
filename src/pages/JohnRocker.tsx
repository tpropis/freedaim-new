import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Download, ArrowLeft, Shirt, ScanLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_URL = "https://freedaim.com/rocker";

export default function JohnRocker() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(1024);

  useEffect(() => {
    document.title = "The Rocker 49 Drop — Freedaim";
  }, []);

  const download = () => {
    const canvas = wrapRef.current?.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `freedaim-john-rocker-qr-${size}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <Link
          to="/merch"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-crimson hover:text-crimson-glow transition-colors"
        >
          <ArrowLeft size={14} /> Merch
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: artwork + story */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-crimson">
                Hidden Drop — Scan to Unlock
              </p>
              <h1 className="mt-3 text-5xl font-black uppercase tracking-tight md:text-7xl">
                The Rocker 49
              </h1>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                You scanned the shirt. That means you either love 90s baseball, hate
                political correctness, or your uncle dared you. Either way — welcome.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="overflow-hidden rounded-xl border border-border/40 bg-[#0a0f1c]">
                <div className="aspect-[3/4] w-full bg-black p-6 md:p-8">
                  <img
                    src="/rocker-front.png"
                    alt="Front artwork for the Rocker 49 shirt"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="border-t border-border/40 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-crimson">
                    Front Print
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The statement. Front and center.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border/40 bg-[#0a0f1c]">
                <div className="aspect-[3/4] w-full bg-black p-6 md:p-8">
                  <img
                    src="/rocker-back.png"
                    alt="Back artwork for the Rocker 49 shirt with number 49 and signature"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="border-t border-border/40 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-crimson">
                    Back Print
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Arch logo / 49 / signature. Clean, loud, unmistakable.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-3"
            >
              <div className="rounded-xl border border-border/40 bg-[#0a0f1c] p-5">
                <Shirt className="mb-3 h-5 w-5 text-crimson" />
                <p className="text-xs font-black uppercase tracking-wider">The Garment</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Premium heavyweight tee. Fits like you played relief in the NL East.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-[#0a0f1c] p-5">
                <ScanLine className="mb-3 h-5 w-5 text-crimson" />
                <p className="text-xs font-black uppercase tracking-wider">The QR</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Level-H code. Scans through ink, lint, and mild regret.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-[#0a0f1c] p-5">
                <Sparkles className="mb-3 h-5 w-5 text-crimson" />
                <p className="text-xs font-black uppercase tracking-wider">The Vibe</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Not licensed. Not sorry. Built for the bleachers and the comments section.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: QR + download */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6 lg:sticky lg:top-8"
          >
            <div className="rounded-2xl border border-border/40 bg-[#0a0f1c] p-6 md:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-crimson">
                Printable QR Code
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This is the exact code that ships on the shirt. Download it, send it to your
                printer, and make sure it lands dead center so people can actually scan it.
              </p>

              <div
                ref={wrapRef}
                className="mx-auto mt-6 w-fit rounded-xl border border-border/50 bg-white p-5"
              >
                <QRCodeCanvas
                  value={PAGE_URL}
                  size={size}
                  level="H"
                  marginSize={2}
                  fgColor="#030712"
                  bgColor="#ffffff"
                  style={{ width: 260, height: 260 }}
                />
              </div>

              <div className="mt-6">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-crimson">
                  Export size
                </p>
                <div className="flex flex-wrap gap-2">
                  {[512, 1024, 2048].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-bold ${
                        size === s
                          ? "border-crimson bg-crimson/15 text-foreground"
                          : "border-border/60 text-muted-foreground hover:border-crimson/60"
                      }`}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={download}
                className="mt-6 w-full bg-crimson font-bold uppercase tracking-wide text-primary-foreground hover:bg-crimson-glow"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR (PNG)
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Error correction level H — stays scannable even with ink bleed or a logo
                placed over the center.
              </p>
            </div>

            <div className="rounded-2xl border border-border/40 bg-[#0a0f1c] p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-crimson">
                Destination
              </p>
              <p className="mt-1 break-all font-mono text-sm text-muted-foreground">
                {PAGE_URL}
              </p>
            </div>

            <div className="rounded-2xl border border-crimson/20 bg-crimson/5 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-crimson">
                Pro tip
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                If someone scans your shirt and asks why it doesn’t go to a store page, tell
                them it’s a collector’s item. Then send them to{" "}
                <Link to="/merch" className="font-bold text-foreground underline hover:text-crimson">
                  the merch page
                </Link>{" "}
                before they ask too many questions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
