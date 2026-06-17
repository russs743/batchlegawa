"use client";

import { useState, useTransition } from "react";
import { addComment } from "@/app/actions";
import { allMembers } from "@/components/MembersGrid";
import { useRouter } from "next/navigation";

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

export default function KesanPesanForm() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    // Generate random coordinates between 10 and 90 to ensure it fits well on board
    const randomX = Math.floor(Math.random() * 80) + 10;
    const randomY = Math.floor(Math.random() * 80) + 10;
    
    formData.append("x", randomX.toString());
    formData.append("y", randomY.toString());
    formData.append("color", selectedColor);

    startTransition(async () => {
      const result = await addComment(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/#comments");
        }, 1500);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full bg-theme-text text-theme-bg p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center justify-center animate-fade-in border border-theme-border">
        <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mb-6 text-2xl animate-hero-float">
          ✨
        </div>
        <h3 className="font-serif text-3xl font-bold mb-2">Pesan Terkirim!</h3>
        <p className="font-sans opacity-80 mb-6">Membawamu melihat papan mading...</p>
        <div className="w-6 h-6 border-2 border-theme-bg border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <form 
      action={handleSubmit} 
      className={`relative w-full p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col gap-5 border-2 transition-colors duration-500 ${selectedColor.split(' ')[0]} ${selectedColor.split(' ')[2]}`}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full shadow-md border-2 border-red-700 z-10"></div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-black/20 rounded-full blur-[2px] -z-10"></div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold opacity-60 uppercase tracking-wider text-inherit">Nama Kamu</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Siapa namamu?"
          className="w-full bg-black/5 border-b-2 border-black/10 px-3 py-2 focus:outline-none focus:border-black/30 transition-colors placeholder:text-black/50 text-black font-medium rounded-t-md"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold opacity-60 uppercase tracking-wider text-inherit">Untuk Siapa?</label>
        <select
          name="target"
          required
          className="w-full bg-black/5 border-b-2 border-black/10 px-3 py-2 focus:outline-none focus:border-black/30 transition-colors cursor-pointer text-black font-medium rounded-t-md"
        >
          {targets.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-xs font-bold opacity-60 uppercase tracking-wider text-inherit">Pesanmu</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tulis pesan, kesan, atau ceritamu di sini..."
          className="w-full bg-black/5 border-b-2 border-black/10 px-3 py-2 focus:outline-none focus:border-black/30 transition-colors resize-none placeholder:text-black/50 text-black font-medium rounded-t-md"
        ></textarea>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-t border-black/10">
        <label className="text-xs font-bold opacity-60 uppercase tracking-wider text-inherit text-center mb-1">Pilih Warna Kertas</label>
        <div className="flex justify-center gap-4">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${c.split(' ')[0]} ${
                selectedColor === c ? 'border-black/60 scale-125 shadow-md' : 'border-black/10'
              }`}
              aria-label="Pilih warna"
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full py-4 bg-black/80 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Mengirim...</span>
          </>
        ) : (
          "Tempel di Mading"
        )}
      </button>
    </form>
  );
}
