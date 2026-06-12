"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { allMembers } from "@/components/MembersGrid";

export default function RosterPage() {
  const router = useRouter();
  const [activeMember, setActiveMember] = useState(allMembers[0]);
  const [isMobileStatsOpen, setIsMobileStatsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Mobile check
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    // Save original theme state
    const isOriginallyDark =
      document.documentElement.classList.contains("dark");

    // Force brand/dark theme on this page
    document.documentElement.classList.add("dark");

    return () => {
      window.removeEventListener("resize", handleResize);
      // Restore original theme when leaving
      if (!isOriginallyDark) {
        document.documentElement.classList.remove("dark");
      }
    };
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    // If there is history, go back to preserve scroll position. Otherwise, go home.
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="relative w-full h-screen bg-black overflow-hidden select-none">
        {/* Background Legawa Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 w-full h-full flex items-center justify-center">
          <Image
            src="/legawa-logo.png"
            alt="Legawa Background"
            width={1600}
            height={800}
            className="object-contain opacity-[0.03] dark:opacity-[0.05] filter-(--logo-filter)"
          />
        </div>

        {/* Close Button */}
        <a
          href="/"
          onClick={handleClose}
          className="absolute top-6 right-6 md:top-10 md:right-10 z-110 text-theme-text opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2 group/close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </a>

        {/* The Cutout Image (Fullscreen, behind roster) */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMember.name}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {(() => {
                const src =
                  activeMember.choseImage ||
                  activeMember.image ||
                  activeMember.placeholder;
                const isVideo = src?.endsWith(".mp4") || src?.endsWith(".webm");

                if (isVideo) {
                  return (
                    <video
                      src={src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover object-center origin-center transition-transform duration-[2s]"
                    />
                  );
                }

                return (
                  <Image
                    src={src}
                    alt={activeMember.name}
                    fill
                    priority
                    className="object-cover object-center origin-center transition-transform duration-[2s]"
                  />
                );
              })()}

              {/* Legawa Style Fade into Background */}
              <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-linear-to-t from-theme-bg via-theme-bg/60 to-transparent opacity-100"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Character Text Display */}
        <div className="absolute inset-x-0 bottom-[140px] md:bottom-[200px] flex flex-col justify-end p-6 md:p-16 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMember.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl"
            >
              {activeMember.nameImage ? (
                <div className="relative h-48 md:h-72 lg:h-[400px] w-full max-w-[95vw] md:max-w-[1200px] z-10 drop-shadow-xl">
                  <Image
                    src={activeMember.nameImage}
                    alt={activeMember.name}
                    fill
                    className="object-contain object-left invert brightness-0"
                  />
                </div>
              ) : (
                <h3 className="font-serif text-theme-text text-6xl md:text-8xl lg:text-[7rem] font-bold uppercase tracking-widest leading-none z-10 relative drop-shadow-md">
                  {activeMember.name}
                </h3>
              )}
              <span className="font-serif text-theme-accent tracking-widest text-xl md:text-3xl md:ml-8 block font-medium drop-shadow-lg relative z-20 -mt-4 md:-mt-10">
                {activeMember.role}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Stats Toggle Button */}
        <AnimatePresence>
          {isMobile && !isMobileStatsOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsMobileStatsOpen(true)}
              className="absolute top-[100px] right-4 z-30 pointer-events-auto bg-theme-bg/80 backdrop-blur-md border border-theme-accent/50 text-theme-accent px-5 py-3 rounded-full text-xs font-sans tracking-[0.2em] uppercase flex items-center gap-2 drop-shadow-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Stats</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Character Stats Display */}
        <div className="absolute right-4 md:right-16 top-[100px] md:top-auto md:bottom-[240px] flex flex-col items-end z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            {(!isMobile || isMobileStatsOpen) && (activeMember as any).stats && (
              <motion.div
                key={activeMember.name + "-stats"}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="flex flex-col items-end gap-2 md:gap-4 bg-theme-bg/20 backdrop-blur-md border border-theme-border/50 p-3 md:p-6 rounded-2xl w-[170px] md:w-[300px] drop-shadow-xl relative pointer-events-auto"
              >
                {isMobile && (
                  <button 
                    onClick={() => setIsMobileStatsOpen(false)}
                    className="absolute top-0 right-0 text-theme-text/80 hover:text-theme-text transition-colors p-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <h4 className="font-sans text-[0.65rem] md:text-sm tracking-[0.2em] uppercase opacity-70 mb-1 md:mb-2 border-b border-theme-border/50 pb-1 md:pb-2 w-full text-left text-theme-text mt-2 md:mt-0 pr-8">Attributes</h4>
                {Object.entries((activeMember as any).stats).map(([key, value]) => (
                  <div key={key} className="w-full flex items-center justify-between gap-4">
                    <span className="font-sans text-[0.65rem] md:text-xs tracking-wider uppercase opacity-80 text-theme-text">{key}</span>
                    <div className="flex-1 h-1.5 md:h-2 bg-theme-border/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="h-full bg-theme-accent rounded-full"
                      />
                    </div>
                    <span className="font-serif text-sm md:text-base font-bold w-8 text-right text-theme-text">{value as number}</span>
                  </div>
                ))}
                
                <button className="mt-3 md:mt-6 pointer-events-auto w-full py-1.5 md:py-3 px-3 md:px-4 border border-theme-accent/50 hover:bg-theme-accent hover:text-theme-bg text-theme-accent transition-colors duration-300 font-sans text-[0.55rem] md:text-sm tracking-[0.2em] uppercase rounded-full flex items-center justify-center gap-2 group/details">
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 transform group-hover/details:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Roster Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[160px] md:h-[240px] flex items-center z-50 bg-linear-to-t from-theme-bg via-theme-bg/95 to-transparent">
          <span className="font-sans text-xs tracking-[0.2em] uppercase opacity-40 px-4 md:px-12 hidden md:block shrink-0">
            Select
            <br />
            Intern
          </span>
          <div
            className="flex-1 h-full overflow-x-auto custom-scrollbar flex items-center"
            onWheel={(e) => {
              if (e.currentTarget && e.deltaY !== 0) {
                e.currentTarget.scrollBy({
                  left: e.deltaY * 2,
                  behavior: "smooth",
                });
              }
            }}
          >
            <div className="flex gap-6 md:gap-12 items-center px-4 md:px-0 w-max min-w-full pb-2">
              {allMembers.map((member) => {
                const isActive = activeMember.name === member.name;
                return (
                  <button
                    key={member.name}
                    onClick={() => setActiveMember(member)}
                    className={`relative flex flex-col items-center justify-center gap-4 transition-all duration-500 outline-none group/thumb ${
                      isActive
                        ? "scale-110 -translate-y-2 opacity-100"
                        : "opacity-40 hover:opacity-100 hover:-translate-y-1"
                    }`}
                  >
                    {/* Circular Logo/Thumbnail */}
                    <div
                      className={`relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden transition-all duration-300 ${isActive ? "border-2 border-theme-accent ring-4 ring-theme-accent/20" : "border border-theme-border"}`}
                    >
                      <Image
                        src={member.logoImage || member.placeholder}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <span className="font-serif text-sm md:text-lg tracking-widest uppercase text-theme-text font-medium">
                      {member.name}
                    </span>

                    {/* Active Indicator Line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorBottom"
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-10 md:w-16 h-1 md:h-1.5 rounded-full bg-theme-accent"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
