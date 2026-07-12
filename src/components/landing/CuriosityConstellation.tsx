"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive "curiosity graph": floating question-nodes drift with light
 * physics, link to nearby nodes with hairlines, reach toward the cursor,
 * and occasionally pulse green as they get "verified". A living metaphor
 * for Eureka — you connect to questions, not people.
 */

const QUESTIONS = [
  "Why do we dream?",
  "What is dark matter?",
  "Can aging be reversed?",
  "How did life begin?",
  "Is time an illusion?",
  "What is consciousness?",
  "Are we alone?",
  "Why is the sky dark at night?",
];

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  label?: string;
  pulse: number; // 0 = idle, else animation progress 0..1
}

function readColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: s.getPropertyValue("--accent").trim() || "#00e676",
    border: s.getPropertyValue("--border").trim() || "#e5e5e5",
    faint: s.getPropertyValue("--faint").trim() || "#9b9b9b",
  };
}

export function CuriosityConstellation({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const cv: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let colors = readColors();
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let lastPulse = 0;

    const NODE_COUNT = 22;
    const LINK_DIST = 150;

    function seed() {
      nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        label: i < QUESTIONS.length ? QUESTIONS[i] : undefined,
        pulse: 0,
      }));
    }

    function resize() {
      const rect = cv.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) seed();
    }

    function hexToRgba(hex: string, a: number) {
      let c = hex.replace("#", "");
      if (c.length === 3)
        c = c
          .split("")
          .map((x) => x + x)
          .join("");
      const n = parseInt(c, 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    }

    function step(t: number) {
      ctx.clearRect(0, 0, w, h);

      // trigger a verify-pulse periodically
      if (t - lastPulse > 2200) {
        lastPulse = t;
        const idle = nodes.filter((n) => n.pulse === 0);
        if (idle.length)
          idle[Math.floor(Math.random() * idle.length)].pulse = 0.0001;
      }

      // update positions
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));

        // gentle attraction toward cursor
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 220 && d > 1) {
            n.x += (dx / d) * (1 - d / 220) * 0.6;
            n.y += (dy / d) * (1 - d / 220) * 0.6;
          }
        }
        if (n.pulse > 0) n.pulse = Math.min(1, n.pulse + 0.012);
        if (n.pulse >= 1) n.pulse = 0;
      }

      // links between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const near =
              mouse.active &&
              (Math.hypot(mouse.x - a.x, mouse.y - a.y) < 160 ||
                Math.hypot(mouse.x - b.x, mouse.y - b.y) < 160);
            const base = (1 - d / LINK_DIST) * (near ? 0.55 : 0.16);
            ctx.strokeStyle = near
              ? hexToRgba(colors.accent, base)
              : hexToRgba(colors.faint, base);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // links from cursor to nearby nodes (you → questions)
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
          if (d < 200) {
            ctx.strokeStyle = hexToRgba(colors.accent, (1 - d / 200) * 0.6);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // nodes (squares — matches Eureka's dot-matrix motif)
      for (const n of nodes) {
        const size = n.label ? 5 : 3;
        ctx.fillStyle = n.label
          ? colors.accent
          : hexToRgba(colors.faint, 0.7);
        ctx.fillRect(n.x - size / 2, n.y - size / 2, size, size);

        // verify pulse: expanding green square ring
        if (n.pulse > 0) {
          const r = 4 + n.pulse * 22;
          ctx.strokeStyle = hexToRgba(colors.accent, (1 - n.pulse) * 0.8);
          ctx.lineWidth = 1;
          ctx.strokeRect(n.x - r, n.y - r, r * 2, r * 2);
        }

        // labels for question-nodes
        if (n.label) {
          const near =
            mouse.active && Math.hypot(mouse.x - n.x, mouse.y - n.y) < 170;
          ctx.fillStyle = hexToRgba(colors.faint, near ? 0.95 : 0.5);
          ctx.font =
            "500 10px ui-monospace, 'JetBrains Mono', SFMono-Regular, monospace";
          const tw = ctx.measureText(n.label).width;
          const flip = n.x + 9 + tw > w - 8;
          ctx.fillText(n.label, flip ? n.x - 9 - tw : n.x + 9, n.y + 3);
        }
      }

      raf = requestAnimationFrame(step);
    }

    function onMove(e: MouseEvent) {
      const rect = cv.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    raf = requestAnimationFrame(step);

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
