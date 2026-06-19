"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { motion } from "framer-motion";
import { addComment, updateCommentPosition, getComments } from "@/app/actions";
import { allMembers } from "@/components/MembersGrid";

const colors = [
  "bg-yellow-200 text-yellow-900 border-yellow-300",
  "bg-pink-200 text-pink-900 border-pink-300",
  "bg-blue-200 text-blue-900 border-blue-300",
  "bg-green-200 text-green-900 border-green-300",
];

const targets = [
  "Semua (Batch)",
  ...allMembers.map((member) => member.name),
];

const filterTargets = [
  "Semua Data",
  ...targets,
];

export default function StickyBoardClient({ initialComments }: { initialComments: any[] }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const newNoteRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Pagination State
  const [displayedComments, setDisplayedComments] = useState(initialComments);
  const [hasMore, setHasMore] = useState(initialComments.length >= 30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and View State
  const [filterTarget, setFilterTarget] = useState("Semua Data");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [masonryCols, setMasonryCols] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setMasonryCols(1);
      else if (width < 768) setMasonryCols(2);
      else if (width < 1024) setMasonryCols(3);
      else setMasonryCols(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredComments = displayedComments.filter(
    (c) => filterTarget === "Semua Data" || c.target === filterTarget
  );

  const masonryColumns = Array.from({ length: masonryCols }, () => [] as any[]);
  filteredComments.forEach((comment, index) => {
    masonryColumns[index % masonryCols].push(comment);
  });

  // New Note State
  const [newNoteColor, setNewNoteColor] = useState(colors[0]);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const moreComments = await getComments(30, displayedComments.length);
      if (moreComments.length > 0) {
        setDisplayedComments(prev => [...prev, ...moreComments]);
      }
      if (moreComments.length < 30) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
          <span className="font-sans text-xs md:text-sm tracking-wider uppercase opacity-70 text-theme-text">
            Digital Yearbook
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-theme-text mt-1">
            Message Board
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          {/* View Toggles */}
          <div className="flex bg-theme-text/10 rounded-full p-1 items-center">
            <button
              onClick={() => setViewMode("board")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === "board" ? "bg-theme-text text-theme-bg shadow-md" : "text-theme-text/70 hover:text-theme-text"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === "list" ? "bg-theme-text text-theme-bg shadow-md" : "text-theme-text/70 hover:text-theme-text"
              }`}
            >
              List
            </button>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            className="bg-transparent border-2 border-theme-text/20 rounded-full px-4 py-2.5 text-sm font-bold text-theme-text outline-none focus:border-theme-text transition-colors cursor-pointer w-full sm:w-auto"
          >
            {filterTargets.map(t => (
              <option key={t} value={t} className="text-black">{t}</option>
            ))}
          </select>

          {!isAdding && viewMode === "board" && (
            <button
              onClick={handleAddClick}
              className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-theme-text text-theme-bg font-serif font-bold text-sm md:text-base rounded-full shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap w-full sm:w-auto"
            >
              <span>+ Tulis Note</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === "board" ? (
      <div 
        ref={boardRef}
        className="relative w-full h-[800px] md:h-[900px] bg-[#2a2a2a] rounded-3xl overflow-hidden border-8 border-[#4a3b32] shadow-inner flex items-center justify-center cursor-crosshair"
        style={{
          backgroundImage: "radial-gradient(#ffffff11 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        {/* Render existing comments */}
        {filteredComments.map((comment) => (
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

        {/* Load More Button */}
        {hasMore && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full font-serif font-bold text-sm md:text-base border border-white/20 shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Muat Lebih Banyak"}
            </button>
          </div>
        )}

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
      ) : (
        <div className="w-full flex flex-col gap-6 relative animate-fade-in">
          {filteredComments.length === 0 ? (
            <div className="w-full py-20 text-center flex flex-col items-center justify-center opacity-70">
              <span className="text-4xl mb-4">📭</span>
              <p className="font-serif text-xl font-bold text-theme-text">Belum ada pesan untuk kategori ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
              {masonryColumns.map((col, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-6">
                  {col.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`w-full p-4 shadow-lg flex flex-col gap-2 ${comment.color || colors[0]} rounded-md transform transition-transform hover:scale-[1.02]`}
                      style={{
                        rotate: (comment.id * 3) % 4 - 2 + "deg"
                      }}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-sm border border-red-700"></div>
                      <div className="flex justify-between items-start border-b border-black/10 pb-2 mb-1 mt-2">
                        <span className="font-bold text-sm truncate pr-2">{comment.name}</span>
                        <span className="text-[10px] bg-black/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Untuk: {comment.target}
                        </span>
                      </div>
                      <p className="font-sans text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {comment.message}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Load More Button for List */}
          {hasMore && (
            <div className="w-full flex justify-center py-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2 bg-theme-text hover:bg-theme-text/80 text-theme-bg rounded-full font-serif font-bold text-sm md:text-base shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoadingMore ? "Loading..." : "Muat Lebih Banyak"}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
