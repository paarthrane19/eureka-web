"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { CredibilityArc } from "@/components/CredibilityIndicator";
import { DepthDots, LEVEL_LABELS } from "@/components/DepthDots";
import { SourceBadge } from "@/components/SourceBadge";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* DEPTH SCROLLING — auto-cycling Hook → Explain → Deep Dive           */
/* ------------------------------------------------------------------ */

const DEPTH_LEVELS = [
  "Time literally runs faster at your head than at your feet.",
  "Einstein's general relativity says gravity slows time. The weaker the gravitational pull, the faster clocks tick — so your head, further from Earth's core, ages marginally faster.",
  "This is gravitational time dilation. Atomic clocks raised just 33 cm apart measurably disagree — confirmed by NIST in 2010. Over a lifetime the difference is billionths of a second, but it is real, measured, and foundational to how GPS satellites correct their clocks.",
];

export function DepthDemo() {
  const [level, setLevel] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setLevel((l) => (l + 1) % DEPTH_LEVELS.length),
      2600,
    );
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative bg-surface hairline p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="bg-[#3B82F6]" style={{ width: 6, height: 6 }} />
          <span className="font-mono text-2xs font-medium tracking-widest text-text">
            PHYSICS
          </span>
        </span>
        <span className="font-mono text-2xs tracking-widest text-faint">
          {LEVEL_LABELS[level]}
        </span>
      </div>

      <div className="min-h-[9rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              level === 0
                ? "font-display text-xl font-bold leading-snug tracking-tight text-text"
                : "font-sans text-[15px] leading-relaxed text-muted",
            )}
          >
            {DEPTH_LEVELS[level]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <DepthDots count={3} active={level} onSelect={setLevel} />
        <span className="font-mono text-2xs tracking-widest text-faint">
          SWIPE TO GO DEEPER →
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VERIFIED SCORE — credibility arc + source                           */
/* ------------------------------------------------------------------ */

export function VerifiedDemo() {
  return (
    <div className="bg-surface hairline p-6">
      <div className="flex items-center gap-6">
        <CredibilityArc score={97} size={112} stroke={5} />
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="bg-[#F59E0B]" style={{ width: 6, height: 6 }} />
            <span className="font-mono text-2xs font-medium tracking-widest text-text">
              CHEMISTRY
            </span>
          </span>
          <p className="mt-2 font-display text-lg font-bold leading-snug tracking-tight text-text">
            Glass is not a slow-moving liquid.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Check size={13} className="text-accent" />
            <span className="font-mono text-2xs uppercase tracking-wider text-accentInk">
              664 verified
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <SourceBadge
          source={{
            source_type: "journal",
            title: "American Journal of Physics · Vol. 66",
            url: "https://example.org",
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CURIOSITY GRAPH — followable questions + study circles              */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  { q: "Why is the universe expanding faster?", n: "3.2k" },
  { q: "Can we reverse cellular aging?", n: "5.8k" },
  { q: "What is dark matter made of?", n: "9.1k" },
];

const CIRCLES = [
  { name: "Quantum Computing", members: "1.4k" },
  { name: "Neuroscience Weekly", members: "882" },
];

export function GraphDemo() {
  const [followed, setFollowed] = useState<Record<number, boolean>>({ 0: true });
  const [joined, setJoined] = useState<Record<number, boolean>>({});

  return (
    <div className="bg-surface hairline p-6">
      <span className="font-mono text-2xs uppercase tracking-widest text-faint">
        Questions you follow
      </span>
      <div className="mt-3 space-y-2">
        {QUESTIONS.map((item, i) => (
          <button
            key={i}
            onClick={() => setFollowed((f) => ({ ...f, [i]: !f[i] }))}
            className="flex w-full items-center justify-between gap-3 hairline px-3 py-2.5 text-left transition duration-fast hover:border-accent"
          >
            <span className="min-w-0">
              <span className="block truncate font-sans text-sm text-text">
                {item.q}
              </span>
              <span className="font-mono text-2xs tracking-wider text-faint">
                {item.n} following
              </span>
            </span>
            <span
              className={cn(
                "flex h-6 items-center gap-1 px-2 font-mono text-2xs uppercase tracking-wider transition duration-fast",
                followed[i]
                  ? "bg-accent text-accentText"
                  : "hairline text-muted",
              )}
            >
              {followed[i] ? <Check size={11} /> : <Plus size={11} />}
              {followed[i] ? "Following" : "Follow"}
            </span>
          </button>
        ))}
      </div>

      <span className="mt-6 block font-mono text-2xs uppercase tracking-widest text-faint">
        Study circles
      </span>
      <div className="mt-3 space-y-2">
        {CIRCLES.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 hairline px-3 py-2.5"
          >
            <span className="flex items-center gap-2">
              <Users size={14} className="text-muted" />
              <span className="font-sans text-sm text-text">{c.name}</span>
              <span className="font-mono text-2xs tracking-wider text-faint">
                {c.members}
              </span>
            </span>
            <button
              onClick={() => setJoined((j) => ({ ...j, [i]: !j[i] }))}
              className={cn(
                "h-6 px-2 font-mono text-2xs uppercase tracking-wider transition duration-fast",
                joined[i] ? "bg-accent text-accentText" : "hairline text-muted",
              )}
            >
              {joined[i] ? "Joined" : "Join"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
