"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const iotm = [
  { month: "January", name: "Afia", image: "/interns/fia.jpg", dir: -1 },
  {
    month: "February",
    name: "Hezky",
    image: "/interns/hezky.jpg",
    dir: 1,
    video: "/iotm/Hezky.mp4",
  },
  {
    month: "March",
    name: "Ilham",
    image: "/interns/ilham.jpg",
    dir: -1,
    video: "/iotm/Ilham.mp4",
  },
  {
    month: "April",
    name: "Rusydi",
    image: "/interns/rusydi.jpg",
    dir: 1,
    video: "/iotm/Rusydi.mp4",
  },
  { month: "May", name: "Luna", image: "/interns/luna.jpg", dir: -1 },
  {
    month: "June",
    name: "Rafi",
    image: "/interns/rafi.jpg",
    dir: 1,
    video: "/iotm/Rafi.mp4",
  },
];

function InternCard({
  member,
  scrollYProgress,
  index,
}: {
  member: any;
  scrollYProgress: any;
  index: number;
}) {
  // Calculate the scroll range for this specific card
  // Total 6 cards. We use 0.8 (80%) of the scroll for animations, leaving the last 20% as a sticky pause
  const activeRange = 0.8;
  const start = index * (activeRange / 6);
  const end = start + activeRange / 6;

  // Transform y from 100% or -100% to 0%
  const yProgress = useTransform(
    scrollYProgress,
    [start, end],
    [member.dir * 100, 0],
  );
  const y = useTransform(yProgress, (val) => `${val}%`);

  return (
    <motion.div
      style={{ y }}
      className="relative w-full h-[40svh] md:h-full overflow-hidden group cursor-pointer border-r border-b md:border-b-0 border-white/10 transition-all duration-500 md:flex-1 md:hover:flex-[1.5] max-md:!transform-none"
    >
      <div className="absolute inset-0 bg-black/40 z-20 transition-colors duration-500 group-hover:bg-black/10 pointer-events-none"></div>

      {/* 
        OPTIMIZATION: 
        1. Menggunakan <video> tag langsung dengan 'poster' sebagai pengganti Image. 
        2. autoPlay, loop, muted, playsInline: Standar agar video otomatis jalan di semua device tanpa suara.
        3. Jika HP sedang low-power mode, HP otomatis tidak menjalankan video 
           dan hanya menampilkan gambar poster.
      */}
      <video
        src={member.video || "https://www.w3schools.com/html/mov_bbb.mp4"}
        poster={member.image}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover origin-top transform scale-[1.2] transition-transform duration-700 group-hover:scale-[1.05] z-0"
      />

      <div className="absolute bottom-0 left-0 w-full p-2 md:p-10 z-30 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none flex flex-col justify-end h-[60%]">
        <p className="text-white/70 font-sans text-[10px] md:text-sm tracking-widest uppercase mb-0.5 md:mb-1">
          {member.month}
        </p>
        <h3 className="text-white font-serif text-base md:text-4xl font-bold tracking-wide leading-tight">
          {member.name}
        </h3>
      </div>
    </motion.div>
  );
}

export default function InternOfTheMonth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative w-full md:h-[400vh] bg-theme-bg"
    >
      <div className="md:sticky md:top-0 left-0 w-full h-auto md:h-screen overflow-hidden flex flex-col pb-6 md:pb-0">
        <div className="relative md:absolute top-0 left-0 w-full flex justify-between items-center px-4 md:px-10 py-6 md:py-10 text-theme-text z-30 pointer-events-none drop-shadow-md">
          <span className="font-sans text-[10px] md:text-sm tracking-wider uppercase opacity-70">
            Hall of Fame
          </span>
          <h2
            className="font-serif text-xl md:text-3xl font-bold uppercase tracking-widest text-center"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
          >
            Intern of the Month
          </h2>
          <span className="font-sans text-xs tracking-wider uppercase opacity-70 hidden md:block">
            Jan - Jun 2026
          </span>
        </div>

        <div className="relative w-full grid grid-cols-3 md:flex md:flex-row md:flex-1 group/grid">
          {iotm.map((member, index) => (
            <InternCard
              key={member.name}
              member={member}
              index={index}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
