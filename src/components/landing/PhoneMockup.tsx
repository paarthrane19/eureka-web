"use client";

import { motion } from "framer-motion";

import { ScanLine } from "@/components/ScanLine";

const FEED = [
  {
    cat: "PHYSICS",
    color: "#3B82F6",
    title: "Time runs faster at your head than your feet.",
    score: 94,
    verified: 847,
    t: "2h",
  },
  {
    cat: "BIOLOGY",
    color: "#10B981",
    title: "Your gut has more neurons than a cat's brain.",
    score: 88,
    verified: 512,
    t: "4h",
  },
  {
    cat: "ASTRONOMY",
    color: "#8B5CF6",
    title: "There are more trees on Earth than stars in the Milky Way.",
    score: 91,
    verified: 1203,
    t: "6h",
  },
  {
    cat: "CHEMISTRY",
    color: "#F59E0B",
    title: "Glass is not a slow-moving liquid. That's a myth.",
    score: 97,
    verified: 664,
    t: "9h",
  },
  {
    cat: "MATH",
    color: "#EF4444",
    title: "A deck of cards shuffled well has likely never existed before.",
    score: 99,
    verified: 2041,
    t: "12h",
  },
];

function MiniCard({ item }: { item: (typeof FEED)[number] }) {
  const filled = Math.round((item.score / 100) * 8);
  return (
    <div className="hairline-b px-4 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span style={{ width: 6, height: 6, backgroundColor: item.color }} />
          <span className="font-mono text-[9px] font-medium tracking-widest text-text">
            {item.cat}
          </span>
        </span>
        <span className="flex items-center gap-[2px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className={i < filled ? "bg-accent" : "bg-border"}
              style={{ width: 4, height: 4 }}
            />
          ))}
        </span>
      </div>
      <p className="font-display text-[15px] font-bold leading-snug tracking-tight text-text">
        {item.title}
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="h-4 w-6 bg-accent" style={{ height: 3 }} />
        <span className="w-6 bg-border" style={{ height: 3 }} />
        <span className="w-6 bg-border" style={{ height: 3 }} />
        <span className="ml-2 font-mono text-[9px] tracking-wider text-faint">
          <span className="text-accentInk">{item.verified} VERIFIED</span> · {item.t}
        </span>
      </div>
    </div>
  );
}

export function PhoneMockup() {
  const loop = [...FEED, ...FEED];
  return (
    <div className="relative mx-auto w-[300px]">
      {/* Ambient accent glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 bg-accent/10 blur-3xl" />
      <div className="relative h-[600px] overflow-hidden bg-surface hairline shadow-2xl">
        {/* Status/header */}
        <div className="hairline-b px-4 pb-3 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold tracking-tight">
              Eureka
            </span>
            <span className="font-mono text-[9px] tracking-widest text-faint">
              FOR YOU
            </span>
          </div>
          <div className="mt-3">
            <ScanLine height={2} />
          </div>
        </div>

        {/* Scrolling feed */}
        <div className="relative h-[calc(600px-72px)] overflow-hidden">
          <motion.div
            animate={{ y: ["0%", "-50%"] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          >
            {loop.map((item, i) => (
              <MiniCard key={i} item={item} />
            ))}
          </motion.div>
          {/* Fade masks */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
        </div>
      </div>
    </div>
  );
}
