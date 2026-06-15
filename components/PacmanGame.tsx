"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const CELL_SIZE = 28; // Diperbesar dari 24 ke 28 agar lebih lega
const COLS = 21;
const ROWS = 21;

// 1 = Wall, 0 = Dot, 3 = Empty, 4 = Power Pellet, 5 = Ghost House Wall
const INITIAL_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 4, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 4, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 3, 1, 3, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3, 3],
  [1, 1, 1, 1, 1, 0, 1, 3, 1, 5, 5, 5, 1, 3, 1, 0, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 3, 0, 3, 3, 1, 3, 3, 3, 1, 3, 3, 0, 3, 3, 3, 3, 3],
  [1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1, 1],
  [3, 3, 3, 3, 1, 0, 1, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 3, 3, 3, 3],
  [1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const PACMAN_FACES = [
  "EL.png", "HEZKY.png", "cel.png", "fia.png", "iam.png", 
  "lun.png", "nauli.png", "nia.png", "pais.png", "rapi.png", 
  "rus.png", "ubay.png", "van.png"
];

const DIR = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
  NONE: { x: 0, y: 0 }
};

export default function PacmanGame({ onClose }: { onClose?: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);
  const [score, setScore] = useState(0);
  const [scaredTimer, setScaredTimer] = useState(0);
  const [, setRenderTick] = useState(0);

  // Entities
  const [playerFace, setPlayerFace] = useState("");
  const [ghostFaces, setGhostFaces] = useState<string[]>([]);

  // Menggunakan useRef agar game loop terhindar dari Closure Stale State
  const mapRef = useRef<number[][]>([]);
  const playerRef = useRef({ x: 10, y: 16, dir: DIR.NONE, nextDir: DIR.NONE }); // Posisi awal diperbaiki
  const ghostsRef = useRef([
    { id: 0, x: 9, y: 10, dir: DIR.UP },
    { id: 1, x: 10, y: 10, dir: DIR.UP },
    { id: 2, x: 11, y: 10, dir: DIR.UP },
    { id: 3, x: 10, y: 9, dir: DIR.UP },
  ]);
  const scaredRef = useRef(0);

  useEffect(() => {
    mapRef.current = INITIAL_MAP.map(r => [...r]);
    const shuffled = [...PACMAN_FACES].sort(() => 0.5 - Math.random());
    setPlayerFace(shuffled[0]);
    setGhostFaces([shuffled[1], shuffled[2], shuffled[3], shuffled[4]]);
  }, []);

  const handleInsertCoin = () => {
    setIsSelectingCharacter(true);
  };

  const startGame = (selectedFace: string) => {
    mapRef.current = INITIAL_MAP.map(r => [...r]);
    playerRef.current = { x: 10, y: 16, dir: DIR.NONE, nextDir: DIR.NONE };
    ghostsRef.current = [
      { id: 0, x: 9, y: 10, dir: DIR.UP },
      { id: 1, x: 10, y: 10, dir: DIR.UP },
      { id: 2, x: 11, y: 10, dir: DIR.UP },
      { id: 3, x: 10, y: 9, dir: DIR.UP },
    ];
    scaredRef.current = 0;
    
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setScaredTimer(0);
    
    setPlayerFace(selectedFace);
    const remainingFaces = PACMAN_FACES.filter(f => f !== selectedFace).sort(() => 0.5 - Math.random());
    setGhostFaces([remainingFaces[0], remainingFaces[1], remainingFaces[2], remainingFaces[3]]);
    
    setIsSelectingCharacter(false);
    setIsPlaying(true);
  };

  // Keyboard Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Mencegah layar ter-scroll saat main
      }
      if (!isPlaying) return;
      if (e.key === 'ArrowUp') playerRef.current.nextDir = DIR.UP;
      if (e.key === 'ArrowDown') playerRef.current.nextDir = DIR.DOWN;
      if (e.key === 'ArrowLeft') playerRef.current.nextDir = DIR.LEFT;
      if (e.key === 'ArrowRight') playerRef.current.nextDir = DIR.RIGHT;
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Main Game Engine Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      let p = playerRef.current;
      let m = mapRef.current;
      let gs = ghostsRef.current;

      // Scared Timer Countdown
      if (scaredRef.current > 0) {
        scaredRef.current--;
        setScaredTimer(scaredRef.current);
      }

      // 1. Move Player
      let nextX = p.x + p.nextDir.x;
      let nextY = p.y + p.nextDir.y;
      if (nextX < 0) nextX = COLS - 1;
      if (nextX >= COLS) nextX = 0;

      if (m[nextY]?.[nextX] !== 1 && m[nextY]?.[nextX] !== 5) {
        p.x = nextX; p.y = nextY; p.dir = p.nextDir;
      } else {
        nextX = p.x + p.dir.x;
        nextY = p.y + p.dir.y;
        if (nextX < 0) nextX = COLS - 1;
        if (nextX >= COLS) nextX = 0;

        if (m[nextY]?.[nextX] !== 1 && m[nextY]?.[nextX] !== 5) {
          p.x = nextX; p.y = nextY;
        } else {
          p.dir = DIR.NONE;
        }
      }

      // 2. Eat Dots
      if (m[p.y]?.[p.x] === 0) {
        m[p.y][p.x] = 3;
        setScore(s => s + 10);
      }
      if (m[p.y]?.[p.x] === 4) {
        m[p.y][p.x] = 3;
        setScore(s => s + 50);
        scaredRef.current = 40; // 40 ticks
        setScaredTimer(40);
      }

      // 3. Move Ghosts
      gs.forEach(g => {
        const possible = [DIR.UP, DIR.DOWN, DIR.LEFT, DIR.RIGHT].filter(d => {
          if (d.x === -g.dir.x && d.y === -g.dir.y && (g.dir.x !== 0 || g.dir.y !== 0)) return false;
          let nx = g.x + d.x; let ny = g.y + d.y;
          if (nx < 0 || nx >= COLS) return true;
          return m[ny]?.[nx] !== 1;
        });

        if (possible.length === 0) possible.push({ x: -g.dir.x, y: -g.dir.y });
        
        // Mode Panik (Scared) -> Lari acak
        if (scaredRef.current > 0) {
          const chosen = possible[Math.floor(Math.random() * possible.length)] || DIR.NONE;
          let nx = g.x + chosen.x; let ny = g.y + chosen.y;
          if (nx < 0) nx = COLS - 1; if (nx >= COLS) nx = 0;
          g.x = nx; g.y = ny; g.dir = chosen;
          return;
        }

        // Tentukan Target berdasarkan "Kepribadian" Hantu (Blinky, Pinky, Inky, Clyde)
        let targetX = p.x;
        let targetY = p.y;

        if (g.id === 0) {
          // Hantu 1: Agresif kejar langsung ke posisi pemain
          targetX = p.x;
          targetY = p.y;
        } else if (g.id === 1) {
          // Hantu 2: Menghadang 4 kotak di depan pemain
          targetX = p.x + p.dir.x * 4;
          targetY = p.y + p.dir.y * 4;
        } else if (g.id === 2) {
          // Hantu 3: Sulit ditebak (50% agresif, 50% acak)
          if (Math.random() > 0.5) {
            targetX = p.x; targetY = p.y;
          } else {
            targetX = Math.floor(Math.random() * COLS);
            targetY = Math.floor(Math.random() * ROWS);
          }
        } else if (g.id === 3) {
          // Hantu 4: Kejar kalau jauh, tapi menyebar kalau terlalu dekat
          const dist = Math.abs(p.x - g.x) + Math.abs(p.y - g.y);
          if (dist > 6) {
            targetX = p.x; targetY = p.y;
          } else {
            targetX = 0; targetY = ROWS - 1; // Lari ke pojok kiri bawah
          }
        }

        // Cari arah dari 'possible' yang paling mendekatkan ke targetX, targetY
        let bestDir = possible[0] || DIR.NONE;
        let minDist = Infinity;

        possible.forEach(d => {
          let nx = g.x + d.x; let ny = g.y + d.y;
          const distSq = Math.pow(nx - targetX, 2) + Math.pow(ny - targetY, 2);
          if (distSq < minDist) {
            minDist = distSq;
            bestDir = d;
          }
        });

        let nx = g.x + bestDir.x; let ny = g.y + bestDir.y;
        if (nx < 0) nx = COLS - 1;
        if (nx >= COLS) nx = 0;

        g.x = nx; g.y = ny; g.dir = bestDir;
      });

      // 4. Win/Loss Logic
      const dots = m.flat().filter(c => c === 0 || c === 4).length;
      if (dots === 0) {
        setGameWon(true); setIsPlaying(false);
      }

      gs.forEach(g => {
        if (g.x === p.x && g.y === p.y) {
          if (scaredRef.current > 0) {
            setScore(s => s + 200);
            g.x = 10; g.y = 10; g.dir = DIR.UP;
          } else {
            setGameOver(true); setIsPlaying(false);
          }
        }
      });

      // Force React to re-render UI
      setRenderTick(t => t + 1);
    }, 180); // Game Speed

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDPad = (dir: any) => {
    playerRef.current.nextDir = dir;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl relative w-full max-w-[800px] mx-auto text-white">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold text-3xl z-50">
          ×
        </button>
      )}

      <div className="flex items-center justify-between w-full max-w-[500px] mb-4 font-mono text-xl md:text-2xl text-yellow-400">
        <div>SCORE: {score}</div>
        {scaredTimer > 0 && <div className="text-blue-400 animate-pulse">POWER: {scaredTimer}</div>}
      </div>

      <div className="w-full flex justify-center overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] items-center">
        <div 
          className="relative bg-black border-4 border-blue-900 rounded-lg shadow-[0_0_20px_rgba(30,58,138,0.5)] origin-center scale-[0.6] sm:scale-75 md:scale-100 transition-transform"
          style={{ width: COLS * CELL_SIZE, height: ROWS * CELL_SIZE }}
        >
          {/* Render Map */}
          {mapRef.current.map((row, y) => (
            row.map((cell, x) => (
              <div key={`${x}-${y}`} className="absolute" style={{ left: x * CELL_SIZE, top: y * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE }}>
                {cell === 1 && <div className="w-full h-full bg-blue-900 border border-blue-800" />}
                {cell === 5 && <div className="w-full h-full bg-blue-900/30 border-t-2 border-pink-500" />}
                {cell === 0 && <div className="w-2 h-2 bg-yellow-200 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                {cell === 4 && <div className="w-4 h-4 bg-yellow-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />}
              </div>
            ))
          ))}

          {/* Render Player */}
          <div 
            className="absolute z-20 transition-all duration-150" 
            style={{ 
              left: playerRef.current.x * CELL_SIZE - (CELL_SIZE * 0.4), 
              top: playerRef.current.y * CELL_SIZE - (CELL_SIZE * 0.4), 
              width: CELL_SIZE * 1.8, 
              height: CELL_SIZE * 1.8 
            }}
          >
            {playerFace && (
              <Image src={`/PacMan/${playerFace}`} alt="Player" width={64} height={64} className="object-contain w-full h-full drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]" />
            )}
          </div>

          {/* Render Ghosts */}
          {ghostsRef.current.map((g, i) => (
            <div 
              key={g.id}
              className="absolute z-10 transition-all duration-150" 
              style={{ 
                left: g.x * CELL_SIZE - (CELL_SIZE * 0.3), 
                top: g.y * CELL_SIZE - (CELL_SIZE * 0.3), 
                width: CELL_SIZE * 1.6, 
                height: CELL_SIZE * 1.6 
              }}
            >
              {ghostFaces[i] && (
                 <Image 
                   src={`/PacMan/${ghostFaces[i]}`} 
                   alt="Ghost" 
                   width={64} 
                   height={64} 
                   className={`object-contain w-full h-full transition-all ${scaredTimer > 0 ? 'opacity-50 grayscale drop-shadow-[0_0_15px_rgba(59,130,246,1)]' : 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} 
                 />
              )}
            </div>
          ))}

          {/* Overlays */}
          {!isPlaying && !gameOver && !gameWon && !isSelectingCharacter && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
              <h2 className="text-4xl md:text-5xl font-black text-yellow-400 mb-6 font-mono tracking-widest text-center drop-shadow-lg">LEGAWA-MAN</h2>
              <button 
                onClick={handleInsertCoin}
                className="px-8 py-4 bg-yellow-400 text-black font-bold text-xl md:text-2xl rounded-full hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_30px_rgba(250,204,21,0.5)]"
              >
                INSERT COIN
              </button>
              <p className="mt-6 text-zinc-400 font-mono text-sm text-center">Use Arrow Keys or Swipe to move</p>
            </div>
          )}

          {isSelectingCharacter && (
            <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center z-40 p-4">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-6 font-mono text-center">PILIH KARAKTERMU</h2>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4 overflow-y-auto max-h-[400px] p-2">
                {PACMAN_FACES.map(face => (
                  <button 
                    key={face}
                    onClick={() => startGame(face)}
                    className="group relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-zinc-700 hover:border-yellow-400 hover:scale-110 transition-all focus:outline-none focus:ring-4 focus:ring-yellow-400/50"
                  >
                    <Image src={`/PacMan/${face}`} alt={face} fill className="object-cover rounded-full" />
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-30">
              <h2 className="text-5xl font-black text-white mb-2 font-mono">WASTED</h2>
              <p className="text-2xl text-yellow-300 mb-8 font-mono">SCORE: {score}</p>
              <button 
                onClick={handleInsertCoin}
                className="px-8 py-3 bg-white text-red-900 font-bold text-xl rounded-full hover:bg-gray-200 transition-all"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {gameWon && (
            <div className="absolute inset-0 bg-green-900/90 flex flex-col items-center justify-center z-30">
              <h2 className="text-5xl font-black text-white mb-2 font-mono">YOU WIN!</h2>
              <p className="text-2xl text-yellow-300 mb-8 font-mono">SCORE: {score}</p>
              <button 
                onClick={handleInsertCoin}
                className="px-8 py-3 bg-white text-green-900 font-bold text-xl rounded-full hover:bg-gray-200 transition-all"
              >
                PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center text-zinc-500 font-mono text-xs md:text-sm text-center max-w-[500px]">
        <p>Tip: Makan titik besar untuk membuat temanmu jadi panik!</p>
      </div>

      {/* D-Pad for Mobile */}
      <div className="md:hidden mt-6 grid grid-cols-3 gap-2 w-[200px]">
        <div />
        <button onClick={() => handleDPad(DIR.UP)} className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center active:bg-zinc-700 text-2xl">▲</button>
        <div />
        <button onClick={() => handleDPad(DIR.LEFT)} className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center active:bg-zinc-700 text-2xl">◀</button>
        <button onClick={() => handleDPad(DIR.DOWN)} className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center active:bg-zinc-700 text-2xl">▼</button>
        <button onClick={() => handleDPad(DIR.RIGHT)} className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center active:bg-zinc-700 text-2xl">▶</button>
      </div>
    </div>
  );
}
