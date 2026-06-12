import Hero from "@/components/Hero";
import GalleryScroll from "@/components/GalleryScroll";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import MembersGrid from "@/components/MembersGrid";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <GalleryScroll />
      <HorizontalTimeline />
      <MembersGrid />
    </main>
  );
}
