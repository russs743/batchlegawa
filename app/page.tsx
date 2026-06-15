import Hero from "@/components/Hero";
import GalleryScroll from "@/components/GalleryScroll";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import CircularHistory from "@/components/CircularHistory";
import VideoSection from "@/components/VideoSection";
import MembersGrid from "@/components/MembersGrid";
import InternOfTheMonth from "@/components/InternOfTheMonth";
import MomentsSection from "@/components/MomentsSection";
import StickyBoard from "@/components/StickyBoard";
import { getComments } from "@/app/actions";
import PacmanTrigger from "@/components/PacmanTrigger";

export default async function Home() {
  const comments = await getComments();

  return (
    <main className="flex flex-col min-h-screen">
      <Hero comments={comments} />
      <GalleryScroll />
      <HorizontalTimeline />
      <VideoSection />
      <MomentsSection />
      <InternOfTheMonth />
      <CircularHistory />
      <MembersGrid />
      <StickyBoard />
      <PacmanTrigger />
    </main>
  );
}
