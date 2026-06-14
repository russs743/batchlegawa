"use client";

import { useRef, useState, useTransition } from "react";
import { addComment } from "@/app/actions";

export default function CommentForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await addComment(formData);
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
    });
  };

  const targets = [
    "Semua (Batch)",
    "Afia",
    "Hezky",
    "Ilham",
    "Rusydi",
    "Luna",
    "Rafi",
  ];

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-white/60 text-xs tracking-wider uppercase font-sans">
          Nama Anda
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="John Doe"
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="target" className="text-white/60 text-xs tracking-wider uppercase font-sans">
          Pesan Untuk
        </label>
        <select
          id="target"
          name="target"
          required
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all appearance-none cursor-pointer"
        >
          {targets.map((t) => (
            <option key={t} value={t} className="bg-neutral-900">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-white/60 text-xs tracking-wider uppercase font-sans">
          Pesan Anda
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Kesan dan pesan..."
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
