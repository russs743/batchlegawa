"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AftermovieSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center border-t border-white/10">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-20">
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-theme-accent/30 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-10 left-10 z-10 pointer-events-none opacity-50">
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-white/50">
          The Grand Finale
        </span>
      </div>

      <div className="absolute bottom-10 right-10 z-10 pointer-events-none opacity-50 text-right">
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-white/50 block">
          Legawa
        </span>
        <span className="font-sans text-xs tracking-[0.3em] uppercase text-theme-accent block">
          Batch 4
        </span>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center">
        
        {/* Cinematic Header when not playing */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none"
            >
              <h2 className="font-serif text-5xl md:text-7xl lg:text-9xl font-bold text-white uppercase tracking-widest text-center mb-8 drop-shadow-2xl">
                Aftermovie
              </h2>
              <p className="font-sans text-sm md:text-base tracking-[0.2em] text-white/70 max-w-lg text-center mb-12">
                A culmination of memories, laughter, and the journey we shared.
              </p>
              
              <button
                onClick={handlePlay}
                className="pointer-events-auto group relative flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/30 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                {/* Ping animation behind play button */}
                <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
                
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-10 h-10 md:w-12 md:h-12 text-white ml-2 transition-transform duration-500 group-hover:scale-110"
                >
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Player Container */}
        <motion.div
          initial={{ opacity: 0.3, scale: 0.95 }}
          animate={{ 
            opacity: isPlaying ? 1 : 0.3, 
            scale: isPlaying ? 1 : 0.95 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl"
        >
          {/* We only load the actual video when the user clicks play to save massive bandwidth */}
          {isPlaying ? (
            <video
              ref={videoRef}
              src="/aftermovie.mp4"
              controls
              controlsList="nodownload"
              className="w-full h-full object-contain bg-black"
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gray-900 to-black flex items-center justify-center">
              {/* Optional: Add a poster image here if they have one */}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
