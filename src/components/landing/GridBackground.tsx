"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Futuristic backdrop: a faint blueprint grid, a slow-sweeping accent
 * scan band, and a radial vignette so content stays legible on top.
 */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.6] dark:opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 0.5px, transparent 0.5px), linear-gradient(90deg, var(--border) 0.5px, transparent 0.5px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 30%, #000 40%, transparent 100%)",
        }}
      />
      {/* Sweeping accent scan band */}
      <motion.div
        className="absolute inset-x-0 h-[40vh]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(0,230,118,0.06), transparent)",
        }}
        initial={{ y: "-40vh" }}
        animate={{ y: "140vh" }}
        transition={{ duration: 9, ease: "linear", repeat: Infinity }}
      />
      {/* Ambient accent glows */}
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -right-24 top-1/2 h-72 w-72 rounded-full bg-accent/5 blur-3xl" />
    </div>
  );
}
