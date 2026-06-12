import Hero from "@/components/Hero";
import GalleryScroll from "@/components/GalleryScroll";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import VideoSection from "@/components/VideoSection";
import StorySection from "@/components/StorySection";
import MembersGrid from "@/components/MembersGrid";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <GalleryScroll />
      <HorizontalTimeline />
      <VideoSection />
      <StorySection />
      <MembersGrid />
    </main>
  );
}
