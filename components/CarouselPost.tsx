"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface CarouselPostProps {
  images: string[];
  likes: string;
  comments: string;
}

export default function CarouselPost({ images, likes, comments }: CarouselPostProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 < 0 ? images.length - 1 : prev - 1));
  };

  const slideVariants: Variants = {
    hiddenRight: { x: "100%", opacity: 0 },
    hiddenLeft: { x: "-100%", opacity: 0 },
    visible: { x: "0", opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exitRight: { x: "-100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exitLeft: { x: "100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <div className="relative w-full aspect-4/5 overflow-hidden bg-neutral-900 group shadow-2xl hover:shadow-3xl transition-shadow duration-500 rounded-lg">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial={direction > 0 ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit={direction > 0 ? "exitRight" : "exitLeft"}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`Post image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Visible on Hover) */}
      {images.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors shadow-lg"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto hover:bg-white/40 transition-colors shadow-lg"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      )}

    </div>
  );
}
