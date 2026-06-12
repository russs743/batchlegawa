"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

export default function GalleryScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.5) {
      if (activeIndex !== 0) setActiveIndex(0);
    } else {
      if (activeIndex !== 1) setActiveIndex(1);
    }
  });

  // Parallax effects for images (moving at different speeds to create depth)
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-theme-bg transition-colors duration-500"
    >
      {/* Scrolling images with Parallax */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Photo 1 (Moves fast up) */}
        <motion.div
          style={{ y: y1 }}
          className="absolute left-[5%] md:left-[10%] top-[10vh] w-[45vw] md:w-[30vw] xl:w-[25vw] aspect-4/5 overflow-hidden rounded-sm pointer-events-auto shadow-xl will-change-transform"
        >
          <Image
            src="https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260312-WA0076.jpg"
            alt="Gallery 1"
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-cover"
          />
        </motion.div>

        {/* Photo 2 (Moves slower/down relative to scroll) */}
        <motion.div
          style={{ y: y2 }}
          className="absolute right-[5%] md:right-[10%] top-[60vh] w-[55vw] md:w-[35vw] xl:w-[30vw] aspect-3/4 overflow-hidden rounded-sm pointer-events-auto shadow-xl will-change-transform"
        >
          <Image
            src="https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260311-WA0038.jpg"
            alt="Gallery 2"
            fill
            sizes="(max-width: 768px) 45vw, 30vw"
            className="object-cover"
          />
        </motion.div>

        {/* Photo 3 (Moves very fast up) */}
        <motion.div
          style={{ y: y3 }}
          className="absolute left-[8%] md:left-[15%] top-[160vh] w-[40vw] md:w-[25vw] xl:w-[20vw] aspect-square overflow-hidden rounded-sm pointer-events-auto shadow-xl will-change-transform"
        >
          <Image
            src="https://ik.imagekit.io/bhiaoqt1n/legawa/IMG_4599.HEIC.jpg"
            alt="Gallery 3"
            fill
            sizes="(max-width: 768px) 35vw, 20vw"
            className="object-cover"
          />
        </motion.div>

        {/* Photo 4 (Moves slow) */}
        <motion.div
          style={{ y: y4 }}
          className="absolute right-[8%] md:right-[15%] top-[200vh] w-[45vw] md:w-[30vw] xl:w-[25vw] aspect-4/3 overflow-hidden rounded-sm pointer-events-auto shadow-xl will-change-transform"
        >
          <Image
            src="https://ik.imagekit.io/bhiaoqt1n/legawa/IMG-20260308-WA0027.jpg"
            alt="Gallery 4"
            fill
            sizes="(max-width: 768px) 40vw, 25vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Sticky text containers */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden z-10 pointer-events-none px-4 mix-blend-difference dark:mix-blend-normal">
        <AnimatePresence>
          {activeIndex === 0 ? (
            <motion.h2
              key="text1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-black text-white leading-[1.1] text-center max-w-[1000px] tracking-tight pointer-events-auto transition-colors duration-500"
            >
              Thirteen Unique Paths,
              <br />
              One Shared Journey.
            </motion.h2>
          ) : (
            <motion.h2
              key="text2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-black text-white leading-[1.1] text-center max-w-[1000px] tracking-tight pointer-events-auto transition-colors duration-500"
            >
              Moving Forward Together,
              <br />
              Growing As One.
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
