"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin accent bar pinned to the top, filling as you scroll the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent shadow-[0_0_12px_var(--accent)]"
    />
  );
}
