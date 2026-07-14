"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Layers, ShieldCheck, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AnimatedCounter } from "@/components/landing/AnimatedCounter";
import { CuriosityConstellation } from "@/components/landing/CuriosityConstellation";
import { DepthDemo, GraphDemo, VerifiedDemo } from "@/components/landing/Demos";
import { GridBackground } from "@/components/landing/GridBackground";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Parallax } from "@/components/landing/Parallax";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { Reveal } from "@/components/landing/Reveal";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { Logo } from "@/components/Logo";
import { ScanLine } from "@/components/ScanLine";
import { api } from "@/lib/api";

const HEADLINE = ["Every scroll", "teaches you", "something."];
const HEADLINE_2 = ["Every swipe", "teaches you", "more."];

const DIFFERENTIATORS = [
  {
    tag: "01 / DEPTH",
    icon: Layers,
    title: "Depth scrolling",
    lede: "Every fact has three layers. Swipe once for the hook, again to understand, again to go all the way down. Curiosity has a gear for every mood.",
    demo: <DepthDemo />,
  },
  {
    tag: "02 / TRUST",
    icon: ShieldCheck,
    title: "Verified score",
    lede: "No more screenshots of nonsense. Every claim carries a live credibility score and a linked primary source. Truth you can trace.",
    demo: <VerifiedDemo />,
  },
  {
    tag: "03 / GRAPH",
    icon: Share2,
    title: "The curiosity graph",
    lede: "Follow questions, not just people. Join study circles. Your feed is shaped by what you want to understand — not who shouts loudest.",
    demo: <GraphDemo />,
  },
];

export default function LandingPage() {
  const [count, setCount] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.94]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 80]);

  useEffect(() => {
    api
      .waitlistCount()
      .then((r) => setCount(r.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-text">
      <ScrollProgress />
      <LandingHeader />

      {/* ============================ HERO ============================ */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden px-5 pb-24 pt-32 sm:pt-40"
      >
        <GridBackground />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <CuriosityConstellation />
        </div>
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 hairline px-3 py-1.5"
            >
              <span className="h-1.5 w-1.5 animate-pulse bg-accent" />
              <span className="font-mono text-2xs uppercase tracking-widest text-muted">
                Now assembling · v1.0 · Est. 2026
              </span>
            </motion.div>

            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {[HEADLINE, HEADLINE_2].map((line, li) => (
                <span key={li} className="block">
                  {line.map((word, wi) => (
                    <motion.span
                      key={wi}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1 + (li * 3 + wi) * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={li === 1 && wi === 2 ? "text-accent" : undefined}
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-muted"
            >
              Eureka is the social platform for science — where discoveries are
              verified, curiosity is the currency, and going deeper is one swipe
              away.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-8 max-w-lg"
            >
              <WaitlistForm onCount={(n) => setCount(n)} />
              <div className="mt-4 flex items-center gap-3">
                <ScanLine className="w-16" height={2} />
                <span className="font-mono text-2xs uppercase tracking-wider text-faint">
                  {count !== null ? (
                    <>
                      <span className="text-accentInk">
                        <AnimatedCounter value={count} />
                      </span>{" "}
                      curious minds already in
                    </>
                  ) : (
                    "Join the founding class"
                  )}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden justify-center lg:flex"
          >
            <Parallax amount={70}>
              <PhoneMockup />
            </Parallax>
          </motion.div>
        </motion.div>

        {/* Corner coordinate readouts */}
        <div className="pointer-events-none absolute bottom-6 left-5 font-mono text-2xs tracking-widest text-faint">
          40.71°N · 74.00°W
        </div>
        <div className="pointer-events-none absolute bottom-6 right-5 font-mono text-2xs tracking-widest text-faint">
          SIGNAL // STABLE
        </div>
      </section>

      {/* ========================= THE PROBLEM ======================= */}
      <section className="hairline-t bg-surfaceAlt px-5 py-28 sm:py-36">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <span className="font-mono text-2xs uppercase tracking-widest text-faint">
              The problem
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Science content is everywhere.
              <br />
              <span className="text-faint">Truth isn&apos;t.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-muted">
              Your feed is drowning in confident nonsense — engagement-bait
              framed as discovery, screenshots with no source, headlines
              engineered to outrage. Real science gets buried under the loudest
              guess. We&apos;re building the opposite: a place where the most
              verified idea rises, not the most viral one.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== DIFFERENTIATORS ====================== */}
      {DIFFERENTIATORS.map((d, i) => (
        <section key={i} className="hairline-t px-5 py-24 sm:py-32">
          <div
            className={`mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 ${
              i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <Reveal>
              <div>
                <span className="font-mono text-2xs uppercase tracking-widest text-accentInk">
                  {d.tag}
                </span>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center hairline">
                    <d.icon size={18} className="text-accent" />
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {d.title}
                  </h3>
                </div>
                <p className="mt-5 max-w-md font-sans text-lg leading-relaxed text-muted">
                  {d.lede}
                </p>
              </div>
            </Reveal>
            <Parallax amount={i % 2 === 1 ? -40 : 40}>
              <Reveal delay={0.1}>{d.demo}</Reveal>
            </Parallax>
          </div>
        </section>
      ))}

      {/* ========================= WAITLIST CTA ====================== */}
      <section className="relative isolate overflow-hidden hairline-t bg-surfaceAlt px-5 py-32 sm:py-40">
        <GridBackground />
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="mb-6 flex justify-center">
              <ScanLine className="w-28" height={2} />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Join{" "}
              <span className="tabular-nums text-accent">
                {count !== null ? <AnimatedCounter value={count} /> : "the"}
              </span>{" "}
              curious minds
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-lg font-sans text-lg leading-relaxed text-muted">
              Be part of the founding class. Early members shape what Eureka
              becomes — and get in before the doors open.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mx-auto mt-10 max-w-lg">
              <WaitlistForm onCount={(n) => setCount(n)} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FOOTER ========================= */}
      <footer className="hairline-t px-5 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center">
              <Logo className="h-12 w-auto" />
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-faint">
              Built by a 16-year-old who thinks your feed should make you
              smarter.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "About", href: "#" },
              { label: "Contact", href: "mailto:hello@eureka.science" },
              { label: "Instagram", href: "https://instagram.com" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted transition duration-fast hover:text-accent"
              >
                {l.label}
                <ArrowUpRight
                  size={13}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t-0">
          <span className="font-mono text-2xs tracking-widest text-faint">
            © 2026 EUREKA
          </span>
          <span className="font-mono text-2xs tracking-widest text-faint">
            THE SCIENCE NETWORK
          </span>
        </div>
      </footer>
    </div>
  );
}
