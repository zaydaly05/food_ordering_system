import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

const blobAnim = {
  animate: {
    y: [0, -18, 0],
    x: [0, 8, 0],
    scale: [1, 1.05, 1],
  },
};

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let rafId;

    // Respect reduced-motion preference
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const particles = [];
    const baseCount = Math.floor((width * height) / 14000);
    const count = reduceMotion ? 12 : Math.max(20, Math.min(70, baseCount));
    const maxDist = reduceMotion ? 80 : 120;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: 1 + Math.random() * 2,
      });
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    let last = performance.now();
    const targetFPS = reduceMotion ? 15 : 30; // throttle to 30 FPS (or 15 if reduced motion)
    const minDelta = 1000 / targetFPS;

    function draw(now) {
      rafId = requestAnimationFrame(draw);
      const delta = now - last;
      if (delta < minDelta) return;
      last = now - (delta % minDelta);

      ctx.clearRect(0, 0, width, height);

      // subtle background tint for depth
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "rgba(255,240,230,0.02)");
      g.addColorStop(1, "rgba(220,235,255,0.02)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // draw lines (simple, no expensive calculations when reduced-motion)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const d = Math.sqrt(d2);
            const alpha = 0.45 * (1 - d / maxDist);
            ctx.strokeStyle = `rgba(200,210,255,${alpha})`;
            ctx.lineWidth = 1 * (1 - d / maxDist);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // draw particles (no shadows for performance)
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="global-animated-bg" aria-hidden>
      <canvas ref={canvasRef} className="particle-canvas" />
      <motion.div className="bg-blob blob-1" variants={blobAnim} animate="animate" transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="bg-blob blob-2" variants={blobAnim} animate="animate" transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
      <motion.div className="bg-blob blob-3" variants={blobAnim} animate="animate" transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
