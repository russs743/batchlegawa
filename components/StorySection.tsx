"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const storyImages = [
  "/Reveal/tharique.napaz_1773923792_3856274623431785555_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274636249607221_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274650795421316_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274665743966083_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274666624723382_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274693636093794_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923792_3856274698484709040_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923949_3856275966070457146_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923949_3856275989474664775_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923949_3856276004297374615_79732505115.jpg",
  "/Reveal/tharique.napaz_1773923949_3856276016074954259_79732505115.jpg",
];

const STORY_DURATION = 4000; // 4 seconds per story

export default function StorySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextStory = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev < storyImages.length - 1) {
        return prev + 1;
      }
      return 0;
    });
    setProgress(0);
  }, []);

  const prevStory = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
    setProgress(0);
  }, []);

  // Auto advance
  useEffect(() => {
    if (isPaused) return;

    const interval = 50; // Update every 50ms for smooth progress bar
    const step = (interval / STORY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, nextStory]);

  return (
    <section className="relative w-full py-24 md:py-32 bg-theme-bg overflow-hidden flex flex-col items-center">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10 mix-blend-overlay">
        <Image
          src={storyImages[currentIndex]}
          alt="Blurred background"
          fill
          className="object-cover blur-3xl scale-110 transition-all duration-1000"
        />
      </div>

      <div className="container mx-auto px-4 z-10 flex flex-col items-center">
        
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl text-theme-text font-medium tracking-wide"
          >
            Behind the Scenes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-xs md:text-sm tracking-[0.2em] uppercase text-theme-text/60 mt-4"
          >
            The Making of the Reveal
          </motion.p>
        </div>

        {/* Story Viewer */}
        <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black/5 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-theme-border/30">
          
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 w-full p-4 flex gap-1 z-30">
            {storyImages.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ 
                    width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%" 
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info overlay like IG */}
          <div className="absolute top-8 left-0 w-full p-4 flex items-center gap-3 z-30">
            <div className="w-8 h-8 rounded-full border border-white/50 bg-theme-bg overflow-hidden flex items-center justify-center p-1">
               <Image src="/legawa-logo.png" alt="Legawa" width={24} height={24} className="object-contain" />
            </div>
            <span className="font-sans text-xs font-semibold text-white drop-shadow-md">
              legawa.crew
            </span>
            <span className="font-sans text-[0.65rem] text-white/70 drop-shadow-md">
              2h
            </span>
          </div>

          {/* Clickable Areas */}
          <div 
            className="absolute inset-0 w-1/2 z-20 cursor-w-resize" 
            onClick={prevStory}
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          />
          <div 
            className="absolute inset-y-0 right-0 w-1/2 z-20 cursor-e-resize" 
            onClick={nextStory}
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          />

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full bg-black"
            >
              <Image
                src={storyImages[currentIndex]}
                alt={`Story ${currentIndex + 1}`}
                fill
                priority
                className="object-cover object-center pointer-events-none"
              />
              <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

        </div>

        <div className="mt-8 text-theme-text/50 font-sans text-[0.65rem] tracking-[0.1em] uppercase text-center">
          Tap left/right to navigate • Hold to pause
        </div>

      </div>
    </section>
  );
}
