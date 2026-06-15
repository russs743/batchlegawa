"use client";

import React, { useEffect } from 'react';
import PacmanGame from './PacmanGame';
import { motion, AnimatePresence } from 'framer-motion';

interface PacmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PacmanModal({ isOpen, onClose }: PacmanModalProps) {
  
  // Mencegah body scroll saat modal pacman terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 md:p-8"
        >
          {/* Overlay to close on click outside (optional, maybe better not to close accidentally during gameplay) */}
          <div className="absolute inset-0 z-0" />
          
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[800px]"
          >
            <PacmanGame onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
