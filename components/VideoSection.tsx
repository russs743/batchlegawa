"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";

const words = ["Skip", "the", "reading.", "Feel", "the", "rhythm."];

export default function VideoSection() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Play video only when scroll passes 0.4 (after text is fully revealed)
    if (videoRef.current) {
      if (latest >= 0.4 && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else if (latest < 0.4 && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  });

  const videoY = useTransform(scrollYProgress, [0.4, 0.6], ["100vh", "0vh"]);
  const videoWidth = useTransform(scrollYProgress, [0.6, 0.9], ["60vw", "100vw"]);
  const videoHeight = useTransform(scrollYProgress, [0.6, 0.9], ["40vh", "100vh"]);
  const videoBorderRadius = useTransform(scrollYProgress, [0.6, 0.9], ["16px", "0px"]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-theme-bg h-[400vh]"
    >
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Text Container */}
        <div className="absolute top-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 max-w-5xl z-10">
          {words.map((word, i) => (
            <Word key={i} word={word} i={i} total={words.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Video Container */}
        <motion.div
          style={{
            y: videoY,
            width: videoWidth,
            height: videoHeight,
            borderRadius: videoBorderRadius,
          }}
          className="absolute z-20 bg-[#1a1a1a] shadow-2xl flex items-center justify-center overflow-hidden"
        >
          <video
            ref={videoRef}
            src="RevealLegawa.mp4"
            className="w-full h-full object-cover"
            controls
            muted
            loop
            playsInline
            preload="metadata"
          />
        </motion.div>

      </div>
    </section>
  );
}

function Word({ word, i, total, scrollYProgress }: { word: string, i: number, total: number, scrollYProgress: MotionValue<number> }) {
  const start = i * (0.4 / total);
  const end = start + (0.4 / total);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [20, 0]);

  return (
    <motion.span
      style={{ opacity, y }}
      className="font-serif text-4xl md:text-6xl lg:text-7xl text-theme-text font-medium tracking-tight"
    >
      {word}
    </motion.span>
  );
}
