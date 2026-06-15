"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const chapters = [
  {
    id: 1,
    title: "'Siapa' Legawa",
    description: "Enam bulan bareng yang nggak selalu mulus. Di momen ini semua uneg-uneg dan kekesalan ditumpahin, tapi ujung-ujungnya tetep saling memaafkan dan ketawa bareng lagi.",
    image: "/Story/Siapa/Main.jpg",
    video: "/Story/Siapa/Video.mp4"
  },
  {
    id: 2,
    title: "Reveal Legawa",
    description: "Momen syuting video klip dance yang super keren! Di sini kami memperkenalkan setiap member Batch Legawa dengan gaya yang enerjik dan penuh semangat.",
    image: "/Story/Reveal/Main.jpeg",
    video: "/Story/Reveal/Video.mp4"
  },
  {
    id: 3,
    title: "Visit FCN",
    description: "Keseruan satu batch jalan-jalan bareng visit company ke Future Creative Network (FCN). Nambah wawasan keren sekaligus momen bonding yang nggak terlupakan!",
    image: "/Story/VisitFCN/Main.jpg",
    video: "/Story/VisitFCN/Video.mp4"
  },
  {
    id: 4,
    title: "First Day!",
    description: "Hari pertama kumpul! Masih pada canggung dan malu-malu, tapi dari sinilah awal perjalanan panjang dan pertemanan seru kami dimulai.",
    image: "/Story/FistDay/Main.jpg",
    video: "/Story/FistDay/Video.mp4"
  },
  {
    id: 5,
    title: "A Day at Luna's",
    description: "Quality time bareng di minggu kedua. Seharian penuh kita berenang, BBQ-an, sampai karaoke santai untuk ngelepas penat dan bikin ikatan batch ini makin solid.",
    image: "/Story/rumahLuna/Main.jpg",
    video: "/Story/rumahLuna/Video.mp4"
  },
  {
    id: 6,
    title: "Photoshoot Poster Batch",
    description: "Di balik layar keseruan photoshoot buat poster resmi batch kita. Gaya udah paling maksimal buat unjuk gigi formasi lengkap dan pesona anak-anak Legawa!",
    image: "/Story/PhotoshootPoster/Main.jpg",
    video: "/Story/PhotoshootPoster/Video.mp4"
  },
];

const RADIUS_PX = 300;

function OrbitNode({
  chapter,
  index,
  total,
  globalRotation,
  ringTiltScale,
  isPhase3,
  activeIndex
}: {
  chapter: any;
  index: number;
  total: number;
  globalRotation: MotionValue<number>;
  ringTiltScale: MotionValue<number>;
  isPhase3: boolean;
  activeIndex: number;
}) {
  const baseAngle = (index / total) * 360;
  
  const xPos = useTransform([globalRotation, ringTiltScale], ([rot, tilt]: any[]) => {
    const angleRad = (baseAngle + rot - 90) * (Math.PI / 180);
    return RADIUS_PX * Math.cos(angleRad);
  });
  
  const yPos = useTransform([globalRotation, ringTiltScale], ([rot, tilt]: any[]) => {
    const angleRad = (baseAngle + rot - 90) * (Math.PI / 180);
    return RADIUS_PX * tilt * Math.sin(angleRad);
  });
  
  const isActive = isPhase3 && index === activeIndex;
  
  const nodeOpacity = isPhase3 ? (isActive ? 1 : 0.4) : 1;
  const nodeScale = isPhase3 ? (isActive ? 1.0 : 0.6) : 1;

  return (
    // Memastikan sumbu X dan Y titik pusat 0,0 berada persis di tengah layar
    <motion.div 
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{
        x: xPos,
        y: yPos,
      }}
    >
      {/* Menengahkan gambar pada titik pusatnya sendiri */}
      <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <motion.div 
          animate={{ opacity: nodeOpacity, scale: nodeScale }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`relative overflow-hidden rounded-full shadow-2xl bg-black/10 dark:bg-white/10 transition-all duration-700
            w-16 h-16 md:w-28 md:h-28
            ${isActive ? 'ring-4 md:ring-[6px] ring-theme-accent ring-offset-4 ring-offset-theme-bg shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20' : 'z-10'}
          `}
        >
          <Image
            src={chapter.image}
            alt={chapter.title}
            fill
            // Kita naikkan drastis request ukurannya ke Next.js (800px) 
            // Karena gambar ini nantinya akan di-Zoom 5x lipat!
            sizes="(max-width: 768px) 400px, 800px"
            priority={index === 0 || index === 1}
            className="object-cover transition-transform duration-1000 hover:scale-110 cursor-pointer"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function CircularHistory() {
  const containerRef = useRef<HTMLElement>(null);
  const total = chapters.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 15,
    restDelta: 0.001
  });

  const [isPhase3, setIsPhase3] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  const navRotationOffset = useSpring(0, { stiffness: 60, damping: 20 });
  const targetRotationRef = useRef(0);
  
  const [targetX, setTargetX] = useState(5.0 * RADIUS_PX);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        // Mobile: Tetap di tengah (Center)
        setTargetX(5.0 * RADIUS_PX);
      } else {
        // Desktop: Geser gambar ke kiri sebesar 22% lebar layar agar seimbang dengan teks di kanan
        const offsetLeft = -0.22 * window.innerWidth;
        setTargetX(5.0 * RADIUS_PX + offsetLeft);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // PETA ANIMASI SCROLL
  // 0.00 - 0.15 : Cincin bangun dari lonjong menjadi bulat
  const ringTiltScale = useTransform(smoothProgress, [0, 0.15], [0.35, 1]);
  
  // 0.00 - 0.75 : Pengaturan Skala
  const desktopScale = useTransform(smoothProgress, 
    [0, 0.15, 0.4, 0.5, 0.75, 1], 
    [0.4, 0.8, 0.8, 1.2, 5.0, 5.0]
  );
  const mobileScale = useTransform(smoothProgress, 
    [0, 0.15, 0.4, 0.5, 0.75, 1], 
    [0.4, 0.8, 0.8, 1.2, 3.2, 3.2] // Zoom lebih kecil di HP agar tidak menutupi teks
  );
  
  const ringScale = isMobile ? mobileScale : desktopScale;
  
  // 0.50 - 0.75 : Panning Kamera (Menggeser cincin ke targetX responsif)
  const ringTranslateProgress = useTransform(smoothProgress, [0.5, 0.75, 1], [0, 1, 1]);
  const ringTranslateX = useTransform(ringTranslateProgress, (p) => p * targetX);

  // 0.10 - 0.50 : Berputar searah jarum jam untuk membawa Index 0 ke posisi Kiri (270 derajat)
  const scrollRotateZ = useTransform(smoothProgress, [0, 0.1, 0.5, 1], [0, 0, 270, 270]);

  const globalRotateZ = useTransform(() => scrollRotateZ.get() + navRotationOffset.get());

  const centerTextOpacity = useTransform(smoothProgress, [0.4, 0.5], [1, 0]);
  const focusUiOpacity = useTransform(smoothProgress, [0.7, 0.75], [0, 1]);

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      // Masuk Fase Fokus (Zoomed)
      if (v > 0.7 && !isPhase3) {
        setIsPhase3(true);
        setActiveItem(0); 
        targetRotationRef.current = 0;
        navRotationOffset.set(0); 
      } 
      // Keluar Fase Fokus
      else if (v <= 0.7 && isPhase3) {
        setIsPhase3(false);
        targetRotationRef.current = 0;
        navRotationOffset.set(0); 
      }
    });
    return () => unsubscribe();
  }, [smoothProgress, isPhase3, navRotationOffset]);

  const nextItem = () => {
    setActiveItem((prev) => (prev + 1) % total);
    targetRotationRef.current -= (360 / total);
    navRotationOffset.set(targetRotationRef.current);
  };

  const prevItem = () => {
    setActiveItem((prev) => (prev - 1 + total) % total);
    targetRotationRef.current += (360 / total);
    navRotationOffset.set(targetRotationRef.current);
  };

  return (
    <section
      ref={containerRef}
      // HEIGHT 600VH: Memberikan "Bantalan Scroll" ekstra panjang di bagian bawah
      // Ini mencegah halaman langsung ter-scroll ke atas setelah efek Zoom selesai!
      className="relative w-full h-[600vh] bg-theme-bg"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-theme-bg">
        
        {/* Latar Belakang Video (Terlihat Saat Fase Zoom) */}
        <motion.div 
          style={{ opacity: focusUiOpacity }}
          className="absolute inset-0 z-1 overflow-hidden pointer-events-none"
        >
          {chapters.map((chapter: any, index: number) => (
            chapter.video && (
              <video
                key={`bg-video-${chapter.id}`}
                src={chapter.video}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  activeItem === index ? "opacity-100" : "opacity-0"
                }`}
              />
            )
          ))}
          {/* Overlay gelap agar foto dan teks tetap kontras */}
          <div className="absolute inset-0 bg-theme-bg/80 dark:bg-black/80" />
        </motion.div>

        {/* CONTAINER CINCIN: Ditengahkan persis di layar */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            style={{ 
              scale: ringScale,
              x: ringTranslateX,
            }}
            className="relative will-change-transform"
          >
            {chapters.map((chapter, index) => (
              <OrbitNode 
                key={chapter.id}
                chapter={chapter}
                index={index}
                total={total}
                globalRotation={globalRotateZ}
                ringTiltScale={ringTiltScale}
                isPhase3={isPhase3}
                activeIndex={activeItem}
              />
            ))}
          </motion.div>
        </div>

        {/* Teks Tengah Awal */}
        <motion.div 
          style={{ opacity: centerTextOpacity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none z-30 max-w-sm text-center px-4"
        >
          <p className="font-sans text-sm md:text-base text-theme-text/80 dark:text-white/80 leading-relaxed font-medium drop-shadow-sm">
            Thirteen paths forged into one history. Explore the journey of our high-growth chapter.
          </p>
        </motion.div>

        {/* UI Zoom (Panah & Judul - Split Screen Layout) */}
        <motion.div 
          style={{ opacity: focusUiOpacity, pointerEvents: isPhase3 ? 'auto' : 'none' }}
          className="absolute inset-0 z-40 flex flex-col md:flex-row items-center justify-end pb-12 md:pb-0 px-6 md:pr-24 lg:pr-40"
        >
          {/* Kontainer Teks Kanan */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-end md:justify-center items-center md:items-start h-full pb-8 md:pb-0">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-theme-text dark:text-white drop-shadow-lg text-center md:text-left">
              {chapters[activeItem].title}
            </h2>
            <p className="font-sans mt-3 md:mt-6 text-sm md:text-lg text-theme-muted dark:text-white/80 max-w-md text-center md:text-left">
              {chapters[activeItem].description}
            </p>
          </div>

          {/* Navigasi Desktop (Tengah Kanan, Susunan Atas-Bawah) */}
          <div className="hidden md:flex flex-col gap-4 absolute top-1/2 -translate-y-1/2 right-12 lg:right-20">
            <button 
              onClick={prevItem}
              className="w-14 h-14 rounded-full bg-theme-text dark:bg-white text-theme-bg dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </button>
            <button 
              onClick={nextItem}
              className="w-14 h-14 rounded-full bg-theme-text dark:bg-white text-theme-bg dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
          </div>

          {/* Navigasi Mobile (Bawah Kiri Kanan) */}
          <div className="absolute md:hidden bottom-6 left-6">
            <button 
              onClick={prevItem}
              className="w-12 h-12 rounded-full bg-theme-text dark:bg-white text-theme-bg dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              ←
            </button>
          </div>
          <div className="absolute md:hidden bottom-6 right-6">
            <button 
              onClick={nextItem}
              className="w-12 h-12 rounded-full bg-theme-text dark:bg-white text-theme-bg dark:text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              →
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
