import { getComments, addComment } from "@/app/actions";
import CommentForm from "./CommentForm";

export default async function CommentSection() {
  const comments = await getComments();

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <section id="comments" className="relative w-full min-h-screen bg-theme-bg border-t border-theme-border py-16 px-4 md:px-10 flex flex-col items-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Comments List */}
        <div className="flex-1 flex flex-col">
          <div className="mb-8">
            <span className="font-sans text-xs md:text-sm tracking-wider uppercase opacity-70 text-white">
              Digital Yearbook
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mt-2">
              Message Board
            </h2>
            <p className="text-white/60 mt-4 font-sans text-sm md:text-base max-w-md">
              Tinggalkan pesan, kesan, atau sekadar sapaan untuk para intern batch ini!
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {comments.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 border border-dashed border-white/20 rounded-2xl text-white/40 italic">
                Belum ada pesan. Jadilah yang pertama!
              </div>
            ) : (
              comments.map((comment: any) => (
                <div key={comment.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-bold text-lg">{comment.name}</h4>
                      <p className="text-white/40 text-xs font-sans mt-1">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 tracking-wider">
                      Untuk: <strong className="text-white">{comment.target}</strong>
                    </span>
                  </div>
                  <p className="text-white/80 font-sans leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[400px] shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 sticky top-24">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Leave a Message</h3>
            <CommentForm />
          </div>
        </div>

      </div>
    </section>
  );
}
