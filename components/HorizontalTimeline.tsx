"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const chapters = [
  {
    id: 1,
    title: "Chapter I: The Beginning",
    description:
      "Where our paths first crossed and the foundation of our journey was laid.",
    image: "/kelas(2).jpg",
    video: "/Chapter/Chapter1.webm",
    align: "top",
  },
  {
    id: 2,
    title: "Chapter II: Finding Rhythm",
    description:
      "Learning to synchronize our steps and harmonize our diverse perspectives.",
    image: "https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260119-WA0105.jpg",
    video: "/Chapter/Chapter2.webm",
    align: "bottom",
  },
  {
    id: 3,
    title: "Chapter III: Breaking Boundaries",
    description:
      "Pushing past our comfort zones to explore what lies beyond the horizon.",
    image: "https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260308-WA0027.jpg",
    video: "/Chapter/Chapter3.webm",
    align: "top",
  },
  {
    id: 4,
    title: "Chapter IV: Shared Triumphs",
    description:
      "Celebrating the small victories that forged our indestructible bond.",
    image:
      "https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260318-WA00612.jpg?updatedAt=1781149817571",
    video: "/Chapter/Chapter3.webm",
    align: "bottom",
  },
  {
    id: 5,
    title: "Chapter V: Deepening Roots",
    description:
      "A moment of reflection, recognizing the depth of our connection.",
    image: "https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260506-WA00292.jpg",
    video: "/Chapter/Chapter5.webm",
    align: "top",
  },
  {
    id: 6,
    title: "Chapter VI: Moving Forward",
    description:
      "Thirteen unique paths converging into a single, unstoppable force.",
    image: "/Chapter/Chapter6.JPG",
    video: "/Chapter/Chapter6.webm",
    align: "bottom",
  },
];

export default function HorizontalTimeline() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Track vertical scroll inside the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Soft Magnetic Snapping Logic & Video State
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Set scrolling to true immediately
      setIsScrolling(true);

      // Don't snap if we're outside the timeline boundaries or at the very edges
      if (latest <= 0.01 || latest >= 0.99) return;

      const total = chapters.length;
      const nearestIndex = Math.round(latest * (total - 1));
      setActiveIndex(nearestIndex);

      clearTimeout(timeoutId);

      // Wait 250ms after the user stops scrolling before snapping
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
        const targetProgress = nearestIndex / (total - 1);

        // Only snap if we are close but not perfectly snapped yet
        if (Math.abs(latest - targetProgress) > 0.002) {
          const container = containerRef.current;
          if (container) {
            const startY = container.offsetTop;
            const scrollableDistance =
              container.scrollHeight - window.innerHeight;
            const targetY = startY + targetProgress * scrollableDistance;

            if ((window as any).lenis) {
              // Use Lenis for a very slow, elegant, and cinematic pull (1.5s duration)
              (window as any).lenis.scrollTo(targetY, { duration: 1.2 });
            } else {
              window.scrollTo({ top: targetY, behavior: "smooth" });
            }
          }
        }
      }, 250);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [scrollYProgress]);

  // 6 chapters * 100vw = 600vw total width.
  // We want to shift it left by 500vw so the last 100vw is visible at the end.
  // 500 / 600 = 83.333%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-83.333%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[600vh] bg-theme-bg transition-colors duration-1000"
    >
      {/* Sticky container that stays on screen while scrolling */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-luminosity dark:mix-blend-screen bg-theme-bg">
          {chapters.map((chapter, index) => {
            const isActive = index === activeIndex;
            return <ChapterVideo key={chapter.id} src={chapter.video} isActive={isActive} />;
          })}
        </div>

        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-theme-border z-10 -translate-y-1/2" />

        {/* The horizontal scrolling track */}
        <motion.div
          style={{ x }}
          className="relative flex items-center h-full w-[600vw] z-10 will-change-transform"
        >
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="relative w-screen h-full flex items-center justify-center shrink-0 px-10 md:px-20"
            >
              <div
                className={`relative flex flex-col md:flex-row gap-8 items-center w-full max-w-5xl ${
                  chapter.align === "top"
                    ? "md:-translate-y-20"
                    : "md:translate-y-20"
                }`}
              >
                {/* Node Dot on the timeline */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-theme-accent dark:bg-white hidden md:block" />

                {/* Image */}
                <div
                  className={`relative w-full md:w-1/2 aspect-4/3 overflow-hidden rounded-sm shadow-xl order-1 bg-black/5 dark:bg-white/10 ${chapter.align === "top" ? "md:order-1" : "md:order-2"}`}
                >
                  <Image
                    src={chapter.image}
                    alt={chapter.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Text */}
                <div
                  className={`w-full md:w-1/2 flex flex-col justify-center order-2 ${chapter.align === "top" ? "md:order-2" : "md:order-1"}`}
                >
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-theme-muted dark:text-white/80 mb-2">
                    0{chapter.id}
                  </span>
                  <h3 className="font-serif text-3xl md:text-5xl font-bold text-theme-text dark:text-white mb-4">
                    {chapter.title}
                  </h3>
                  <p className="font-sans text-sm md:text-base text-theme-muted dark:text-white/90 leading-relaxed max-w-md">
                    {chapter.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const ChapterVideo = ({ src, isActive }: { src: string; isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      // Play when active
      videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
    } else {
      // Pause when inactive to save resources and prevent browser bugs
      // Wait for the fade-out transition to finish before pausing
      const timeoutId = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, 1000); // 1000ms matches the duration-1000 class
      
      return () => clearTimeout(timeoutId);
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload={isActive ? "auto" : "none"}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
        isActive ? "opacity-30" : "opacity-0"
      }`}
      src={src}
    />
  );
};
