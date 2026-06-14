"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { addComment, updateCommentPosition } from "@/app/actions";

const colors = [
  "bg-yellow-200 text-yellow-900 border-yellow-300",
  "bg-pink-200 text-pink-900 border-pink-300",
  "bg-blue-200 text-blue-900 border-blue-300",
  "bg-green-200 text-green-900 border-green-300",
];

const targets = [
  "Semua (Batch)",
  "Afia",
  "Hezky",
  "Ilham",
  "Rusydi",
  "Luna",
  "Rafi",
];

export default function StickyBoardClient({ initialComments }: { initialComments: any[] }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const newNoteRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // New Note State
  const [newNoteColor, setNewNoteColor] = useState(colors[0]);
  const [isPending, startTransition] = useTransition();

  const handleAddClick = () => {
    setIsAdding(true);
    setNewNoteColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const handleSubmit = (formData: FormData) => {
    let finalX = 50;
    let finalY = 50;

    // Calculate exact position right at the moment of submit
    if (boardRef.current && newNoteRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const noteRect = newNoteRef.current.getBoundingClientRect();
      
      // Center of the sticky note
      const noteCenterX = noteRect.left + noteRect.width / 2;
      const noteCenterY = noteRect.top + noteRect.height / 2;

      const xPercent = ((noteCenterX - boardRect.left) / boardRect.width) * 100;
      const yPercent = ((noteCenterY - boardRect.top) / boardRect.height) * 100;

      finalX = Math.max(0, Math.min(100, xPercent));
      finalY = Math.max(0, Math.min(100, yPercent));
    }

    formData.append("x", finalX.toString());
    formData.append("y", finalY.toString());
    formData.append("color", newNoteColor);

    startTransition(async () => {
      await addComment(formData);
      setIsAdding(false);
    });
  };

  const handleDragExistingNote = (e: any, info: any, id: number) => {
    if (!boardRef.current) return;
    
    // Fallback if e.target isn't an element
    const targetElement = e.target instanceof Element ? e.target : null;
    const noteElement = targetElement?.closest(`.existing-note-${id}`) as HTMLElement;
    
    if (noteElement) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const noteRect = noteElement.getBoundingClientRect();
      
      const centerX = noteRect.left + noteRect.width / 2;
      const centerY = noteRect.top + noteRect.height / 2;
      
      const xPercent = Math.max(0, Math.min(100, ((centerX - boardRect.left) / boardRect.width) * 100));
      const yPercent = Math.max(0, Math.min(100, ((centerY - boardRect.top) / boardRect.height) * 100));
      
      startTransition(() => {
        updateCommentPosition(id, xPercent, yPercent);
      });
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      
      {/* Header with Title and Button */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
        <div className="flex flex-col text-left">
          <span className="font-sans text-xs md:text-sm tracking-wider uppercase opacity-70 text-white">
            Digital Yearbook
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mt-1">
            Message Board
          </h2>
          <p className="text-white/60 mt-2 font-sans text-sm md:text-base max-w-md">
            Tinggalkan pesan untuk para intern dengan menempelkan sticky note!
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={handleAddClick}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black font-serif font-bold text-base md:text-lg rounded-full shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap"
          >
            <span>+ Tulis Sticky Note</span>
          </button>
        )}
      </div>

      {/* Board Canvas */}
      <div 
        ref={boardRef}
        className="relative w-full h-[800px] md:h-[900px] bg-[#2a2a2a] rounded-3xl overflow-hidden border-8 border-[#4a3b32] shadow-inner flex items-center justify-center cursor-crosshair"
        style={{
          backgroundImage: "radial-gradient(#ffffff11 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Render existing comments */}
        {initialComments.map((comment) => (
          <motion.div
            key={comment.id}
            drag
            dragMomentum={false}
            dragConstraints={boardRef}
            onDragEnd={(e, info) => handleDragExistingNote(e, info, comment.id)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`existing-note-${comment.id} absolute w-[250px] p-4 shadow-lg flex flex-col gap-2 ${comment.color || colors[0]} cursor-grab active:cursor-grabbing`}
            style={{
              left: `calc(${comment.x || 50}% - 125px)`,
              top: `calc(${comment.y || 50}% - 100px)`,
              // Add a slight random rotation for realism based on ID
              rotate: (comment.id * 7) % 10 - 5 + "deg"
            }}
          >
            {/* Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-sm border border-red-700"></div>
            
            <div className="flex justify-between items-start border-b border-black/10 pb-2 mb-1">
              <span className="font-bold text-sm truncate">{comment.name}</span>
              <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                Untuk: {comment.target}
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed overflow-hidden wrap-break-word">
              {comment.message}
            </p>
          </motion.div>
        ))}

        {/* New Interactive Sticky Note */}
        {isAdding && (
          <motion.div
            ref={newNoteRef}
            drag
            dragMomentum={false}
            dragConstraints={boardRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            className={`absolute z-50 w-[280px] p-4 shadow-2xl flex flex-col gap-3 cursor-grab active:cursor-grabbing ${newNoteColor}`}
            style={{
              left: `calc(50% - 140px)`,
              top: `calc(50% - 120px)`,
              rotate: "-2deg"
            }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md border border-red-700 animate-pulse"></div>
            
            <form action={handleSubmit} className="flex flex-col gap-2 w-full">
              <p className="text-xs font-bold opacity-50 text-center mb-1 cursor-default pointer-events-none">
                (Geser saya!)
              </p>
              <input
                type="text"
                name="name"
                required
                placeholder="Nama Anda"
                className="w-full bg-black/5 border-b border-black/20 px-2 py-1 text-sm focus:outline-none focus:bg-white/50 placeholder:text-black/30 text-black font-medium"
              />
              <select
                name="target"
                required
                className="w-full bg-black/5 border-b border-black/20 px-2 py-1 text-sm focus:outline-none focus:bg-white/50 cursor-pointer text-black font-medium"
              >
                {targets.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Tulis pesanmu..."
                className="w-full bg-black/5 border-b border-black/20 px-2 py-1 text-sm focus:outline-none focus:bg-white/50 resize-none placeholder:text-black/30 text-black font-medium"
              ></textarea>

              {/* Color Picker */}
              <div className="flex justify-center gap-3 py-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewNoteColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${c.split(' ')[0]} ${
                      newNoteColor === c ? 'border-black/60 scale-125 shadow-sm' : 'border-black/10'
                    }`}
                    aria-label="Pilih warna"
                  />
                ))}
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-2 py-1 bg-black/10 hover:bg-black/20 text-black rounded text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-2 py-1 bg-black/80 text-white hover:bg-black rounded text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isPending ? "..." : "Tempel!"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

    </div>
  );
}
