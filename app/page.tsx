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
import AftermovieSection from "@/components/AftermovieSection";
import FinalSection from "@/components/FinalSection";

export default async function Home() {
  const comments = await getComments();

  return (
    <main className="flex flex-col min-h-screen">
      <div id="home"><Hero comments={comments} /></div>
      <div id="gallery"><GalleryScroll /></div>
      <div id="chapters"><HorizontalTimeline /></div>
      <div id="video"><VideoSection /></div>
      <div id="moments"><MomentsSection /></div>
      <div id="intern-of-the-month"><InternOfTheMonth /></div>
      <div id="history"><CircularHistory /></div>
      <div id="interns"><MembersGrid /></div>
      <div id="aftermovie"><AftermovieSection /></div>
      <div id="messages"><StickyBoard /></div>
      <div id="final"><FinalSection /></div>
      <PacmanTrigger />
    </main>
  );
}
