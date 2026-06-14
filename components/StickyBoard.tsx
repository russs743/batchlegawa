import { getComments } from "@/app/actions";
import StickyBoardClient from "./StickyBoardClient";

export default async function StickyBoard() {
  const comments = await getComments();

  return (
    <section id="comments" className="relative w-full min-h-screen bg-theme-bg border-t border-theme-border py-16 px-4 md:px-10 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <StickyBoardClient initialComments={comments} />
      </div>
    </section>
  );
}
