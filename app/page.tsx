import Hero from "@/components/Hero";
import GalleryScroll from "@/components/GalleryScroll";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import VideoSection from "@/components/VideoSection";
import StorySection from "@/components/StorySection";
import MembersGrid from "@/components/MembersGrid";
import InternOfTheMonth from "@/components/InternOfTheMonth";
import StickyBoard from "@/components/StickyBoard";
import { getComments } from "@/app/actions";

export default async function Home() {
  const comments = await getComments();

  return (
    <main className="flex flex-col min-h-screen">
      <Hero comments={comments} />
      <GalleryScroll />
      <HorizontalTimeline />
      <VideoSection />
      <InternOfTheMonth />
      <MembersGrid />
      <StickyBoard />
    </main>
  );
}
