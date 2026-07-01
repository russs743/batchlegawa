"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const PLAYLIST = [
  {
    id: 1,
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
    src: "/Lagu/birds-of-a-feather.mp3",
    cover: "/Lagu/Birdofafeather.jpg",
    album: "HIT ME HARD AND SOFT",
    duration: "03:30"
  },
  {
    id: 2,
    title: "No Pole",
    artist: "Don Toliver",
    src: "/Lagu/no-pole.mp3",
    cover: "/Lagu/Nopole.jpg",
    album: "Love Sick",
    duration: "03:10"
  },
  {
    id: 3,
    title: "Staying",
    artist: "Lizzy McAlpine",
    src: "/Lagu/staying.mp3",
    cover: "/Lagu/Staying.jpg",
    album: "Older",
    duration: "03:45"
  },
  {
    id: 4,
    title: "Ini Abadi",
    artist: "Perunggu",
    src: "/Lagu/ini-abadi.mp3",
    cover: "/Lagu/Iniabadi.jpg",
    album: "Memorandum",
    duration: "04:20"
  },
  {
    id: 5,
    title: "Where Is My Husband",
    artist: "RAYE",
    src: "/Lagu/where-is-my-husband.mp3",
    cover: "/Lagu/Whereismyhusband.jpg",
    album: "My 21st Century Blues",
    duration: "03:15"
  }
];

// Helper to format time
const formatTime = (time: number) => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [currentTrackIndex]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const playTrack = (index: number) => {
    if (currentTrackIndex === index) {
      togglePlay();
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => console.log("Auto-play prevented", err));
    }
  }, [currentTrackIndex, isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  return (
    <div className="relative z-50 flex flex-col items-end font-sans">
      <audio ref={audioRef} src={currentTrack.src} />

      {/* Spotify Embed-like Popup Widget */}
      <div 
        className={`absolute top-full right-0 mt-4 overflow-hidden rounded-xl shadow-2xl transition-all duration-300 origin-top-right flex flex-col w-[calc(100vw-3rem)] max-w-[420px] sm:w-[420px] ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "#3a4750", maxHeight: "calc(100vh - 120px)" }}
      >
        {/* Top Section */}
        <div className="p-4 flex gap-4 relative shrink-0">
          {/* Spotify Logo Top Right */}
          <div className="absolute top-4 right-4 text-white z-10">
            <svg height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.6 14.4c-.17.27-.52.36-.78.19-2.14-1.3-4.83-1.6-8.02-.88-.3.07-.6-.12-.67-.42-.07-.3.12-.6.42-.67 3.51-.79 6.48-.44 8.86 1.01.27.16.35.5.19.77zm1.08-2.42c-.22.36-.68.47-1.04.25-2.45-1.5-6.2-1.94-9.33-1.06-.4.11-.81-.13-.92-.53-.11-.4.13-.81.53-.92 3.61-.99 7.91-.49 10.73 1.23.35.22.46.68.25 1.04zm.12-2.54c-2.95-1.75-7.82-1.92-10.63-1.06-.5.15-1.01-.13-1.16-.62-.15-.5.13-1.01.62-1.16 3.32-.93 8.67-.73 12.16 1.34.45.27.59.88.32 1.33-.27.46-.88.6-1.33.32z"></path>
            </svg>
          </div>

          {/* Cover Art */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-md overflow-hidden shadow-lg border border-white/10">
            <Image src={currentTrack.cover} alt={currentTrack.title} fill className="object-cover" />
          </div>

          {/* Info & Controls */}
          <div className="flex flex-col flex-1 justify-between py-1 min-w-0">
            {/* Title & Artist */}
            <div className="pr-8 min-w-0">
              <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-1 truncate" title={currentTrack.title}>{currentTrack.title}</h2>
              <p className="text-white/80 text-sm truncate" title={currentTrack.artist}>{currentTrack.artist}</p>
            </div>

            {/* Playback Controls Area */}
            <div className="flex items-center justify-between mt-auto gap-2">
              {/* Timeline controls */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button onClick={handlePrev} className="text-white/70 hover:text-white transition-colors shrink-0">
                  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.3 1a.7.7 0 01.7.7v5.15l9.95-5.744a.7.7 0 011.05.606v12.575a.7.7 0 01-1.05.607L4 9.149V14.3a.7.7 0 01-.7.7H1.7a.7.7 0 01-.7-.7V1.7a.7.7 0 01.7-.7h1.6z"></path></svg>
                </button>
                
                {/* Progress Bar */}
                <div 
                  ref={progressRef}
                  onClick={handleSeek}
                  className="group/progress flex-1 h-1.5 bg-black/30 rounded-full cursor-pointer relative flex items-center min-w-[40px]"
                >
                  <div 
                    className="h-full bg-white/70 group-hover/progress:bg-[#1db954] rounded-full transition-colors relative" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <button onClick={handleNext} className="text-white/70 hover:text-white transition-colors shrink-0">
                  <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"></path></svg>
                </button>
                
                <span className="text-white text-[11px] w-[35px] shrink-0 text-right font-medium">{formatTime(currentTime)}</span>
              </div>

              {/* Big Play Button */}
              <button onClick={togglePlay} className="w-10 h-10 flex shrink-0 items-center justify-center bg-white text-[#3a4750] rounded-full hover:scale-105 transition-transform shadow-lg">
                {isPlaying ? (
                  <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor"><path d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"></path></svg>
                ) : (
                  <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1.713a.7.7 0 011.05-.607l10.89 6.288a.7.7 0 010 1.212L4.05 14.894A.7.7 0 013 14.288V1.713z"></path></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Track List Section */}
        <div 
          className="bg-[#2f3940] h-[220px] overflow-y-auto px-1 py-1 custom-scrollbar border-t border-black/10 shrink-0"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {PLAYLIST.map((track, idx) => {
            const isThisPlaying = idx === currentTrackIndex;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(idx)}
                className={`group flex items-center gap-4 py-2 px-3 rounded-md hover:bg-black/10 transition-colors cursor-pointer ${isThisPlaying ? 'bg-black/5' : ''}`}
              >
                {/* Track Number */}
                <div className="w-4 flex justify-center items-center shrink-0">
                   <span className={`text-[15px] font-medium ${isThisPlaying ? 'text-[#1db954]' : 'text-white/60'}`}>{idx + 1}</span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <span className={`text-[15px] font-bold leading-tight truncate ${isThisPlaying ? 'text-[#1db954]' : 'text-white'}`}>
                    {track.title}
                  </span>
                  <span className="text-[13px] text-white/60 truncate">
                    {track.artist}
                  </span>
                </div>
                
                {/* Duration */}
                <div className="text-white/80 text-[13px] font-medium tracking-wide">
                  {track.duration}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Custom scrollbar styling inline for scoped effect */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.4); }
        `}} />
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white text-[#3a4750] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform hover:bg-gray-100 group border border-gray-200"
      >
        {isPlaying ? (
          <img src="https://open.spotifycdn.com/cdn/images/equaliser-animated-green.f93a2ef4.gif" alt="playing" className="w-4 h-4 filter invert" />
        ) : (
          <svg height="20" width="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.6 14.4c-.17.27-.52.36-.78.19-2.14-1.3-4.83-1.6-8.02-.88-.3.07-.6-.12-.67-.42-.07-.3.12-.6.42-.67 3.51-.79 6.48-.44 8.86 1.01.27.16.35.5.19.77zm1.08-2.42c-.22.36-.68.47-1.04.25-2.45-1.5-6.2-1.94-9.33-1.06-.4.11-.81-.13-.92-.53-.11-.4.13-.81.53-.92 3.61-.99 7.91-.49 10.73 1.23.35.22.46.68.25 1.04zm.12-2.54c-2.95-1.75-7.82-1.92-10.63-1.06-.5.15-1.01-.13-1.16-.62-.15-.5.13-1.01.62-1.16 3.32-.93 8.67-.73 12.16 1.34.45.27.59.88.32 1.33-.27.46-.88.6-1.33.32z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}


