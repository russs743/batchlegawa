import KesanPesanForm from "./KesanPesanForm";
import Link from "next/link";

export const metadata = {
  title: "Tulis Kesan Pesan | Batch Legawa",
};

export default function KesanPesanPage() {
  return (
    <main className="min-h-screen bg-theme-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{
          backgroundImage: "radial-gradient(var(--accent) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
      }}></div>
      
      <div className="z-10 w-full max-w-lg flex flex-col items-center">
        <Link href="/#comments" className="mb-8 group flex items-center gap-2 text-theme-muted hover:text-theme-text transition-colors bg-theme-text/5 px-4 py-2 rounded-full backdrop-blur-sm border border-theme-border">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-sans uppercase tracking-widest text-xs font-bold">Kembali ke Mading</span>
        </Link>
        
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-theme-text mb-4">
            Kesan & Pesan
          </h1>
          <p className="font-sans text-theme-muted max-w-md mx-auto text-sm md:text-base leading-relaxed">
            Tinggalkan jejak, cerita, atau pesan untuk teman-teman batch Legawa.
          </p>
        </div>

        <div className="w-full animate-fade-up">
          <KesanPesanForm />
        </div>
      </div>
    </main>
  );
}
