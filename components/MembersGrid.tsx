"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// UPDATE: 
// 1. Buat folder baru bernama "interns" di dalam folder "public" (jadi lokasinya: public/interns/)
// 2. Masukin foto asli masing-masing member ke folder tersebut. 
// 3. Pastikan nama filenya sama kayak yang ditulis di bawah (misal: faiz.jpg, el.jpg). 
// Kalau formatnya .png atau .jpeg, tinggal ganti aja ekstensi di bawah ini.

const row1 = [
  { name: "Faiz", image: "/interns/faiz.jpg", choseImage: "/Chose/Faiz.jpg", logoImage: "/memberlogo/FAIZ.png", nameImage: "/AssetNama/Faiz.png", placeholder: "/male_intern.png", role: "Graphic Designer", stats: { design: 95, creativity: 90, software: 85, focus: 75 } },
  { name: "El", image: "/interns/el.jpg", choseImage: "/Chose/El.jpg", logoImage: "/memberlogo/EL.png", nameImage: "/AssetNama/Elrummi.png", placeholder: "/male_intern.png", role: "Video Editor", stats: { editing: 95, storytelling: 85, software: 90, patience: 80 } },
  { name: "Rafi", image: "/interns/rafi.jpg", choseImage: "/Chose/Rafi.jpg", logoImage: "/memberlogo/RAFI.png", nameImage: "/AssetNama/Rafi.png", placeholder: "/male_intern.png", role: "KOL Community", stats: { communication: 95, networking: 90, empathy: 85, negotiation: 80 } },
  { name: "Ubay", image: "/interns/ubay.jpg", choseImage: "/Chose/Ubay.jpg", logoImage: "/memberlogo/UBAY.png", nameImage: "/AssetNama/Ubay.png", placeholder: "/male_intern.png", role: "Content Creator TikTok", stats: { trendiness: 95, creativity: 90, charisma: 85, engagement: 80 } },
  { name: "Ilham", image: "/interns/ilham.jpg", choseImage: "/Chose/Ilham.jpg", logoImage: "/memberlogo/ILHAM.png", nameImage: "/AssetNama/Ilham.png", placeholder: "/male_intern.png", role: "Video Editor", stats: { editing: 95, storytelling: 85, software: 90, patience: 80 } },
  { name: "Hezky", image: "/interns/hezky.jpg", choseImage: null, logoImage: "/memberlogo/HEZKY.png", nameImage: "/AssetNama/Hezky.png", placeholder: "/male_intern.png", role: "Content Creator IG", stats: { aesthetics: 95, photography: 90, copywriting: 85, consistency: 80 } },
  { name: "Rusydi", image: "/interns/rusydi.jpg", choseImage: "/Chose/Rusydi.jpg", logoImage: "/memberlogo/RUSYDI.png", nameImage: "/AssetNama/Rusydi.png", placeholder: "/male_intern.png", role: "IT", stats: { logic: 95, problem_solving: 90, coding: 85, coffee: 99 } },
];

const row2 = [
  { name: "Luna", image: "/interns/luna.jpg", choseImage: "/Chose/Luna.jpg", logoImage: "/memberlogo/LUNA.png", nameImage: "/AssetNama/Luna.png", placeholder: "/female_intern.png", role: "KOL Community", stats: { communication: 95, networking: 90, empathy: 85, negotiation: 80 } },
  { name: "Nauli", image: "/interns/nauli.jpg", choseImage: "/Chose/Nauli.mp4", logoImage: "/memberlogo/NAULI.png", nameImage: "/AssetNama/Nauli.png", placeholder: "/female_intern.png", role: "Graphic Designer", stats: { design: 95, creativity: 90, software: 85, focus: 75 } },
  { name: "Nia", image: "/interns/nia.jpg", choseImage: "/Chose/Nia.jpg", logoImage: "/memberlogo/NIA.png", nameImage: "/AssetNama/Nia.png", placeholder: "/female_intern.png", role: "Content Creator TikTok", stats: { trendiness: 95, creativity: 90, charisma: 85, engagement: 80 } },
  { name: "Vania", image: "/interns/vania.jpg", choseImage: null, logoImage: "/memberlogo/VANIA.png", nameImage: "/AssetNama/Vania.png", placeholder: "/female_intern.png", role: "Copywriter", stats: { writing: 95, vocabulary: 90, persuasion: 85, creativity: 85 } },
  { name: "Michelle", image: "/interns/michelle.jpg", choseImage: "/Chose/Michelle.jpg", logoImage: "/memberlogo/MISHELLE.png", nameImage: "/AssetNama/Michelle.png", placeholder: "/female_intern.png", role: "Content Creator IG", stats: { aesthetics: 95, photography: 90, copywriting: 85, consistency: 80 } },
  { name: "Fia", image: "/interns/fia.jpg", choseImage: "/Chose/Afia.jpg", logoImage: "/memberlogo/FIA.png", nameImage: "/AssetNama/Afia.png", placeholder: "/female_intern.png", role: "Intern", stats: { creativity: 85, logic: 80, energy: 90, communication: 85 } },
];

export const allMembers = [...row1, ...row2];

export default function MembersGrid() {
  return (
    <>
      <section className="relative w-full h-[100svh] md:h-screen bg-theme-bg overflow-hidden border-t border-theme-border flex flex-col">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 md:px-10 py-6 md:py-10 text-white z-30 pointer-events-none drop-shadow-md">
          <span className="font-sans text-xs md:text-sm tracking-wider uppercase opacity-70">
            Cretivox Internship Experience
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold">The Interns</h2>
          <span className="font-sans text-xs tracking-wider uppercase opacity-70 hidden md:block">
            2026 © Cretivox Broadcasting Networks
          </span>
        </div>

        <div className="relative w-full flex-1 flex flex-col group/grid">
          {/* Top Row */}
          <div className="flex flex-nowrap w-full flex-1">
            {row1.map((member) => (
              <div
                key={member.name}
                className="relative flex-1 h-full overflow-hidden group"
              >
                <Image
                  src={member.image || member.placeholder}
                  alt={member.name}
                  fill
                  className="object-cover object-top origin-top transform scale-[1.5] md:scale-[1.5]"
                />
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex flex-nowrap w-full flex-1">
            {row2.map((member) => (
              <div
                key={member.name}
                className="relative flex-1 h-full overflow-hidden group"
              >
                <Image
                  src={member.image || member.placeholder}
                  alt={member.name}
                  fill
                  className="object-cover object-top origin-top transform scale-[1.5] md:scale-[1.5] transition-transform duration-700"
                />
              </div>
            ))}
          </div>

          {/* Overlay Background & Button */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none transition-colors duration-700 group-hover/grid:bg-black/50 z-20 flex items-center justify-center">
            <Link 
              href="/roster"
              className="pointer-events-auto flex items-center gap-4 px-6 md:px-8 py-4 md:py-5 bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-full transition-all duration-500 hover:bg-white hover:text-black hover:scale-110 shadow-2xl overflow-hidden group/btn"
            >
              <span className="font-serif text-lg md:text-2xl tracking-[0.3em] uppercase relative z-10">
                Meet The Member</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-500 group-hover/btn:translate-x-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
