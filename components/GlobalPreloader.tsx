"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { allMembers } from "@/components/MembersGrid";

export default function GlobalPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Minimum time to show the intro (2.5 seconds)
    const minLoadTime = 2500;
    const startTime = Date.now();

    const urlsToPreload = new Set<string>();
    
    // Global hero assets or other images could be added here
    urlsToPreload.add("/legawa-logo.png");

    // Gather all roster assets
    allMembers.forEach((member) => {
      if (member.image) urlsToPreload.add(member.image);
      if (member.choseImage) urlsToPreload.add(member.choseImage);
      if (member.logoImage) urlsToPreload.add(member.logoImage);
      if (member.nameImage) urlsToPreload.add(member.nameImage);
    });

    const totalAssets = urlsToPreload.size;
    if (totalAssets === 0) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      setTimeout(() => setIsLoading(false), remaining);
      return;
    }

    let loaded = 0;
    const incrementLoad = () => {
      loaded++;
      setProgress(Math.round((loaded / totalAssets) * 100));
      if (loaded >= totalAssets) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);
        setTimeout(() => {
          setIsLoading(false);
        }, remaining + 600); // Wait for minimum time + small delay for smooth exit
      }
    };

    urlsToPreload.forEach((url) => {
      if (url.endsWith(".mp4")) {
        const req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "blob"; // Download the video to cache it
        req.onload = incrementLoad;
        req.onerror = incrementLoad; // Increment even on error so we don't get stuck
        req.send();
      } else {
        const img = new window.Image();
        img.src = url;
        img.onload = incrementLoad;
        img.onerror = incrementLoad;
      }
    });
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-theme-bg flex flex-col items-center justify-center p-6 pointer-events-auto"
        >
          <div className="w-full max-w-xs md:max-w-md flex flex-col gap-6 md:gap-8 items-center">
            <div className="relative w-64 h-24 md:w-96 md:h-32 animate-pulse drop-shadow-2xl">
              <Image 
                src="/legawa-logo.png" 
                alt="Legawa Logo" 
                fill 
                className="object-contain filter-(--logo-filter)" 
              />
            </div>
            <div className="w-full h-1.5 bg-theme-border/30 rounded-full overflow-hidden relative">
              <motion.div
                className="absolute left-0 top-0 h-full bg-theme-accent rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
            <span className="font-sans text-xs tracking-[0.4em] uppercase text-theme-text/50">
              Loading {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
