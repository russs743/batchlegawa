import Hero from "@/components/Hero";
import GalleryScroll from "@/components/GalleryScroll";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import VideoSection from "@/components/VideoSection";
import StorySection from "@/components/StorySection";
import MembersGrid from "@/components/MembersGrid";
import InternOfTheMonth from "@/components/InternOfTheMonth";
import StickyBoard from "@/components/StickyBoard";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <GalleryScroll />
      <HorizontalTimeline />
      <VideoSection />
      <InternOfTheMonth />
      <MembersGrid />
      <StickyBoard />
    </main>
  );
}
