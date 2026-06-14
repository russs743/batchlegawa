import { getComments } from "@/app/actions";
import StickyBoardClient from "./StickyBoardClient";

export default async function StickyBoard() {
  const comments = await getComments();

  return (
    <section id="comments" className="relative w-full min-h-screen bg-theme-bg border-t border-theme-border py-16 px-4 md:px-10 flex flex-col items-center">
      <div className="w-full flex flex-col mb-10 items-center text-center">
        <span className="font-sans text-xs md:text-sm tracking-wider uppercase opacity-70 text-white">
          Digital Yearbook
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">
          Message Board
        </h2>
        <p className="text-white/60 mt-4 font-sans text-sm md:text-base max-w-md">
          Tinggalkan pesan untuk para intern. Tekan tombol di bawah untuk menempelkan sticky note!
        </p>
      </div>

      <div className="w-full max-w-7xl">
        <StickyBoardClient initialComments={comments} />
      </div>
    </section>
  );
}
