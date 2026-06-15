"use client";

import CarouselPost from "./CarouselPost";

const momentsData = [
  {
    id: 1,
    images: [
      "/Reveal/Instagram1/Main.jpg"
    ],
    likes: "3,380",
    comments: "32"
  },
  {
    id: 2,
    images: [
      "/Reveal/Instagram2/Main.jpg"
    ],
    likes: "3,102",
    comments: "28"
  }
];

export default function MomentsSection() {
  return (
    <section className="relative w-full py-10 md:py-20 bg-theme-bg px-2 md:px-6 overflow-hidden">
      {/* Grid of 2 Posts */}
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {momentsData.map((post) => (
          <CarouselPost 
            key={post.id}
            images={post.images}
            likes={post.likes}
            comments={post.comments}
          />
        ))}
      </div>

    </section>
  );
}
