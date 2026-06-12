"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Floating particle ─── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.4 + 0.1,
    speed: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }));
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [particles] = useState<Particle[]>(() => generateParticles(18));
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  /* mount animation trigger */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* parallax on scroll */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* magnetic mouse effect on logo */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const logoShift = {
    x: mousePos.x * 12,
    y: mousePos.y * 8,
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-svh flex flex-col overflow-hidden bg-theme-bg transition-colors duration-300"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-size-[60px_60px] animate-fade-in after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,transparent_40%,var(--bg)_100%)] transition-colors duration-300" />

      {/* Corner decorations */}
      <div className="absolute z-10 w-6 h-6 sm:w-10 sm:h-10 opacity-0 animate-fade-in [animation-delay:2200ms] top-6 left-6 border-t border-l border-theme-border" />
      <div className="absolute z-10 w-6 h-6 sm:w-10 sm:h-10 opacity-0 animate-fade-in [animation-delay:2200ms] top-6 right-6 border-t border-r border-theme-border" />
      <div className="absolute z-10 w-6 h-6 sm:w-10 sm:h-10 opacity-0 animate-fade-in [animation-delay:2200ms] bottom-18 left-6 border-b border-l border-theme-border" />
      <div className="absolute z-10 w-6 h-6 sm:w-10 sm:h-10 opacity-0 animate-fade-in [animation-delay:2200ms] bottom-18 right-6 border-b border-r border-theme-border" />

      {/* Side labels removed as requested */}

      {/* Floating particles */}
      {mounted &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-(--particle-bg) pointer-events-none transition-colors duration-300"
            style={{
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `drift ${p.speed}s ${p.delay}s linear infinite`,
            }}
          />
        ))}

      {/* ─── Top bar ─── */}
      <header className="relative z-10 flex justify-between items-start px-6 py-5 sm:px-12 sm:py-8 opacity-0 animate-fade-in [animation-delay:300ms]">
        <div className="font-sans text-[0.65rem] font-medium tracking-[0.2em] uppercase text-theme-muted leading-relaxed">
          <strong className="block text-theme-accent tracking-[0.15em] transition-colors duration-300">
            Cretivox Internship Experience II
          </strong>
          Batch 4 · Legawa
        </div>
        <div className="flex items-center">
          <img
            src="https://ik.imagekit.io/bhiaoqt1n/Cretivox%20Logo%20BLACK.png?updatedAt=1770106782519"
            alt="Cretivox"
            className="h-15 w-auto sm:h-16 opacity-80 mix-blend-multiply transition-opacity hover:opacity-100"
          />
        </div>
      </header>

      {/* ─── Center content ─── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        {/* Eyebrow */}
        <p className="font-sans text-[0.85rem] font-bold tracking-[0.3em] uppercase text-theme-muted dark:text-white/80 mb-8 opacity-0 animate-fade-up [animation-delay:500ms]">
          Cretivox Internship Experience II Batch 4
        </p>

        {/* Logo — with magnetic shift */}
        <div
          ref={logoRef}
          className="relative flex w-full px-4 sm:px-12 items-center justify-center mb-6 opacity-0 transition-transform duration-100 ease-out animate-fade-in [animation-delay:700ms]"
          style={
            mounted
              ? {
                  transform: `translate(${logoShift.x}px, ${logoShift.y + scrollY * -0.08}px)`,
                }
              : undefined
          }
        >
          {/* Placeholder to preserve original layout space so surrounding text doesn't move */}
          <div className="w-full max-h-[55vh] max-w-[95vw] md:max-w-[85vw] lg:max-w-[1400px] aspect-1600/600" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-video rounded-[100%] bg-[radial-gradient(ellipse,var(--grid-line)_0%,transparent_70%)] animate-pulse-ring pointer-events-none" />

          <Image
            src="/legawa-logo.png"
            alt="Legawa — Batch Internship Cretivox"
            width={1600}
            height={600}
            priority
            sizes="100vw"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[105vw] md:w-[85vw] max-w-none h-auto object-contain filter-(--logo-filter) transition-[filter] duration-500 ease-out hover:filter-(--logo-filter-hover) pointer-events-none"
          />
        </div>

        {/* Tagline */}
        <p className="max-w-[480px] font-serif text-[clamp(0.95rem,2vw,1.1rem)] font-black text-theme-muted leading-[1.9] tracking-[0.02em] opacity-0 animate-fade-up [animation-delay:1200ms] transition-colors duration-500">
          a state of calm liberation —<br />
          a moment when acceptance turns into freedom,
          <br />
          where you move and breathe without resistance,
          <br />
          and growth feels effortless and true.
        </p>

        <div className="w-full max-w-[360px] h-px bg-[linear-gradient(90deg,transparent,var(--scanline),transparent)] my-8 mx-auto opacity-0 animate-fade-in [animation-delay:1400ms]" />
      </main>

      {/* ─── Scroll indicator ─── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in [animation-delay:2800ms] z-10">
        <div className="w-px h-12 bg-[linear-gradient(to_bottom,var(--border),transparent)] animate-[hero-float_2s_ease-in-out_infinite]" />
      </div>

      {/* ─── Rotating circle badge ─── */}
      <div
        className="hidden sm:block absolute bottom-24 right-16 w-[90px] h-[90px] opacity-0 animate-fade-in [animation-delay:2500ms] z-10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          width="90"
          height="90"
          className="animate-rotate-slow"
        >
          <defs>
            <path
              id="circle-path"
              d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
            />
          </defs>
        </svg>
      </div>
    </section>
  );
}
