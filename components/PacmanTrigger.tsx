"use client";

import React, { useState } from 'react';
import PacmanModal from './PacmanModal';
import { motion } from 'framer-motion';

export default function PacmanTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-[90] flex items-center justify-center w-14 h-14 bg-yellow-400 text-black rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] cursor-pointer overflow-hidden border-2 border-transparent hover:border-black transition-colors"
        title="Play Legawa Pac-Man"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="6" y1="12" x2="10" y2="12"></line>
          <line x1="8" y1="10" x2="8" y2="14"></line>
          <line x1="15" y1="13" x2="15.01" y2="13"></line>
          <line x1="18" y1="11" x2="18.01" y2="11"></line>
          <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
        </svg>
      </motion.button>

      <PacmanModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
