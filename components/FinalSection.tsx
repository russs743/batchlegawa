import Image from "next/image";

export default function FinalSection() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="/Final.JPG"
          alt="Thank You CBN Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-extrabold text-white tracking-wider drop-shadow-2xl uppercase">
          Thank You CBN
        </h1>
      </div>
    </section>
  );
}
