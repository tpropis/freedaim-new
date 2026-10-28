import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import mobileImg from "@/assets/builds/web/mobile.webp";
import websiteImg from "@/assets/builds/web/website.webp";
import saasImg from "@/assets/builds/web/saas.webp";
import automationImg from "@/assets/builds/web/automation.webp";
import productImg from "@/assets/builds/web/product.webp";
import adminImg from "@/assets/builds/web/admin-panel.webp";

const builds = [
  {
    category: "Mobile App Mockup",
    title: "Mobile App Concept",
    caption: "iPhone-style product experiences built for real users, workflows, and launches.",
    image: mobileImg,
  },
  {
    category: "Website Mockup",
    title: "Premium Website Build",
    caption: "Polished launch-ready websites that make new ideas feel credible from day one.",
    image: websiteImg,
  },
  {
    category: "CRM / SaaS Dashboard",
    title: "CRM / SaaS Dashboard",
    caption: "Sales dashboards, customer pipelines, analytics, lead management, and real-time reporting.",
    image: saasImg,
  },
  {
    category: "Automation System",
    title: "Automation & AI Calling System",
    caption: "Website form → CRM capture → AI call → SMS follow-up → booked appointment.",
    image: automationImg,
  },
  {
    category: "Product / Packaging Launch",
    title: "Product & Packaging Launch",
    caption: "Premium product packaging, brand visuals, website assets, and launch campaigns.",
    image: productImg,
  },
  {
    category: "Internal Business Tool",
    title: "Internal Business Tool",
    caption: "Admin panels for customers, orders, tasks, reporting, permissions, and operations.",
    image: adminImg,
  },
];

export default function WhatWeBuild() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ backgroundColor: "#030712" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border pt-40 pb-20 lg:pt-48 lg:pb-28">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--off-white)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--off-white)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-crimson"
          >
            Proof of Build
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-5xl font-black tracking-tight text-gradient-hero sm:text-6xl lg:text-7xl"
          >
            What We Build
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-xl font-semibold text-off-white sm:text-2xl"
          >
            Real ideas. Built into real systems.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            From apps and websites to CRM platforms, automation systems, dashboards, and product launches — Freedaim helps turn concepts into assets that move businesses forward.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="relative py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--off-white)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--off-white)) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {builds.map((b, i) => (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card-gradient transition-all duration-500 hover:border-crimson/40 hover:glow-crimson"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#030712]">
                  <img
                    src={b.image}
                    alt={b.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="p-6">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-crimson/90">
                    {b.category}
                  </p>
                  <h3 className="mb-2 text-lg font-bold tracking-tight">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/80">{b.caption}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border py-28 lg:py-36">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Don't see your idea here?
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              We'll build that too.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/#cta">
                Build My Idea
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
