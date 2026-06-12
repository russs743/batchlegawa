"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { allMembers } from "@/components/MembersGrid";
import { motion, useScroll, useTransform } from "framer-motion";

export default function InternDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<any>(null);

  const { scrollYProgress } = useScroll();
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 2.5]);

  useEffect(() => {
    // Force dark theme for this page
    const timer = setTimeout(() => {
      document.documentElement.classList.add("dark");
    }, 50);
    
    if (params.id) {
      const foundMember = allMembers.find((m: any) => m.id === params.id);
      if (foundMember) {
        setMember(foundMember);
      } else {
        router.push("/roster");
      }
    }

    return () => clearTimeout(timer);
  }, [params.id, router]);

  if (!member) return null;

  return (
    <div className="relative min-h-screen bg-theme-bg overflow-x-hidden selection:bg-theme-accent selection:text-theme-bg">
      {/* Background Silhouette from choseImage */}
      {member.choseImage && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-15 grayscale contrast-125 blur-[2px] flex items-center justify-center mask-image-b">
          {member.choseImage.endsWith(".mp4") ? (
            <video
              src={member.choseImage}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={member.choseImage}
              alt="Silhouette"
              fill
              className="object-cover"
            />
          )}
        </div>
      )}

      {/* Background Logo */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-30 w-full h-full flex items-center justify-center drop-shadow-2xl">
        <Image
          src="/legawa-logo.png"
          alt="Background Logo"
          width={800}
          height={400}
          className="object-contain filter-(--logo-filter)"
        />
      </div>

      {/* Back Button */}
      <Link
        href="/roster"
        className="fixed top-8 left-8 z-50 text-theme-text/70 hover:text-theme-text flex items-center gap-2 font-sans text-xs tracking-widest uppercase transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Roster
      </Link>

      {/* Central Fixed Image */}
      <div className="fixed inset-0 pointer-events-none z-10 flex items-end justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ scale: imageScale, transformOrigin: "50% 15%" }}
          className="relative w-full max-w-2xl h-[85vh] lg:h-[95vh]"
        >
          <Image
            src={member.fullBodyImage || member.placeholder}
            alt={member.name}
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            quality={100}
            priority
          />
        </motion.div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between pointer-events-none">
        
        {/* Left Column (Scrollable) */}
        <div className="w-full md:w-1/3 pt-[60vh] md:pt-[30vh] pb-32 flex flex-col gap-32 pointer-events-auto">
          {/* Info Block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              {member.nameImage ? (
                <div className="relative h-32 md:h-[250px] w-[350px] md:w-[700px] -ml-4 z-10 -mb-10 md:-mb-24 pointer-events-none">
                  <Image
                    src={member.nameImage}
                    alt={member.name}
                    fill
                    className="object-contain object-left invert brightness-0 drop-shadow-md"
                  />
                </div>
              ) : (
                <h1 className="font-serif text-5xl md:text-7xl font-bold text-theme-text uppercase tracking-widest leading-none drop-shadow-md z-10 relative -mb-4">
                  {member.name}
                </h1>
              )}
            </div>
            
            <div className="flex flex-col gap-4 mt-4 bg-theme-text/5 backdrop-blur-md border border-theme-border/30 p-6 rounded-2xl w-max relative z-20">
              <div>
                <p className="font-sans text-[0.6rem] tracking-widest uppercase opacity-50">Domicile</p>
                <p className="font-serif text-xl text-theme-text">{member.domicile}</p>
              </div>
              <div>
                <p className="font-sans text-[0.6rem] tracking-widest uppercase opacity-50">Zodiac</p>
                <p className="font-serif text-xl text-theme-text">{member.zodiac}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-2 w-max">
              <Link
                href="#"
                className="px-6 py-3 border border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-theme-bg transition-colors duration-300 rounded-full font-sans text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume / CV
              </Link>
              <Link
                href="#"
                className="px-6 py-3 bg-theme-text/5 border border-theme-border/30 text-theme-text hover:bg-theme-text hover:text-theme-bg transition-colors duration-300 rounded-full font-sans text-[0.65rem] tracking-[0.2em] uppercase flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Portfolio
              </Link>
            </div>
          </motion.div>

          {/* Dummy Portfolio Items */}
          <div className="flex flex-col gap-12 mt-20">
            <h3 className="font-sans text-xs tracking-widest uppercase text-theme-text/50 border-b border-theme-border/30 pb-2">Selected Works</h3>
            <div className="w-full h-[50vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Project Alpha</span>
            </div>
            <div className="w-full h-[60vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Campaign Visuals</span>
            </div>
            <div className="w-full h-[40vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Design Assets</span>
            </div>
          </div>
        </div>

        {/* Right Column (Scrollable) */}
        <div className="w-full md:w-1/3 pt-[20vh] md:pt-[60vh] pb-32 flex flex-col gap-32 pointer-events-auto">
          {/* Attributes Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <p className="font-serif text-theme-accent text-lg md:text-2xl tracking-[0.2em] uppercase font-bold drop-shadow-lg">
              {member.role}
            </p>
            <div className="flex flex-col gap-4 bg-theme-text/5 backdrop-blur-md border border-theme-border/30 p-6 rounded-2xl">
            <h3 className="font-sans text-[0.6rem] tracking-widest uppercase opacity-50 border-b border-theme-border/30 pb-2 mb-2">Core Stats</h3>
            {member.stats && Object.entries(member.stats).map(([key, value]) => (
              <div key={key} className="w-full flex items-center justify-between gap-4">
                <span className="font-sans text-[0.6rem] tracking-wider uppercase opacity-80 text-theme-text">{key}</span>
                <div className="flex-1 h-1 bg-theme-border/30 rounded-full overflow-hidden">
                  <div className="h-full bg-theme-accent rounded-full" style={{ width: `${value}%` }} />
                </div>
                <span className="font-serif text-sm font-bold text-theme-text w-6 text-right">{value as number}</span>
              </div>
            ))}
          </div>
          </motion.div>

          {/* More Dummy Portfolio Items */}
          <div className="flex flex-col gap-12 mt-12 md:mt-48">
            <div className="w-full h-[60vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Social Media Content</span>
            </div>
            <div className="w-full h-[40vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Behind The Scenes</span>
            </div>
            <div className="w-full h-[70vh] bg-theme-text/10 rounded-xl flex items-center justify-center border border-theme-border/20 backdrop-blur-sm">
              <span className="font-serif text-theme-text/40 tracking-wider">Final Output</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
