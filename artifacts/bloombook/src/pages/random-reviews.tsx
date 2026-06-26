import { useState } from "react";
import { useListReviews, useCreateReview, getListReviewsQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Plus, X, Star } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";

export default function RandomReviews() {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useListReviews();

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [vibeCheck, setVibeCheck] = useState("solid");
  const [reviewText, setReviewText] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);

  const createReview = useCreateReview({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Hot take recorded" });
      }
    }
  });

  const resetForm = () => {
    setSubject("");
    setCategory("");
    setRating(0);
    setVibeCheck("solid");
    setReviewText("");
    setWouldRecommend(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !reviewText) return;
    createReview.mutate({
      data: {
        subject,
        category,
        rating,
        vibeCheck,
        review: reviewText,
        wouldRecommend,
        date: new Date().toISOString()
      }
    });
  };

  const vibes = [
    { id: "immaculate", label: "immaculate", color: "bg-bloom-sage text-[#527A4A] border-[#527A4A]/20" },
    { id: "solid", label: "solid", color: "bg-bloom-blue text-[#366898] border-[#366898]/20" },
    { id: "mid", label: "mid", color: "bg-bloom-butter text-[#C9A430] border-[#C9A430]/20" },
    { id: "not it", label: "not it", color: "bg-bloom-pink-deep text-white border-bloom-pink-deep" },
    { id: "chaotic good", label: "chaotic good", color: "bg-bloom-lavender text-[#8A6BC0] border-[#8A6BC0]/20" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-10 px-5 min-h-[100dvh]"
    >
      <header className="mb-8 text-center">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight bg-gradient-to-r from-bloom-pink to-bloom-lavender text-transparent bg-clip-text">Random Reviews</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">hot takes only.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-pink-light border-t-bloom-pink rounded-full animate-spin" />
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState message="No hot takes yet — everything is reviewable" />
      ) : (
        <div className="space-y-6 pb-6 relative">
          <div className="absolute top-0 bottom-0 left-[20px] w-px bg-bloom-pink-light/50 -z-10" />
          <div className="absolute top-0 bottom-0 right-[20px] w-px bg-bloom-pink-light/50 -z-10" />
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} delay={i * 0.08} />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-pink to-bloom-lavender text-white flex items-center justify-center shadow-[0_8px_20px_rgba(201,184,232,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-review"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="bg-bloom-cream flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-pink/60 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Review</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-6">
                
                <div className="space-y-1.5">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Subject *</label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)} className="w-full h-14 px-4 rounded-[14px] bg-white border border-bloom-pink-light focus:outline-none focus:border-bloom-pink font-lato text-bloom-dark text-lg" placeholder="e.g. That one pen, this obscure album..." />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Category</label>
                    <input value={category} onChange={e => setCategory(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-pink-light focus:outline-none focus:border-bloom-pink font-lato text-bloom-dark" placeholder="Music, Object, Place..." />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Rating</label>
                    <div className="flex gap-1 h-12 items-center px-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform p-1">
                          <Star size={24} fill={star <= rating ? "var(--bloom-pink-deep)" : "transparent"} color={star <= rating ? "var(--bloom-pink-deep)" : "var(--bloom-pink-light)"} strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Vibe Check</label>
                  <div className="flex flex-wrap gap-2">
                    {vibes.map((v, i) => (
                      <motion.button 
                        key={v.id} 
                        type="button" 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setVibeCheck(v.id)} 
                        className={`px-4 py-2 rounded-full font-lato text-sm font-bold border transition-all ${vibeCheck === v.id ? `${v.color} shadow-sm scale-105` : 'bg-white text-bloom-soft border-bloom-pink-light'}`}
                      >
                        {v.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">The Review *</label>
                  <textarea required value={reviewText} onChange={e => setReviewText(e.target.value)} className="w-full h-32 p-4 rounded-[14px] bg-white border border-bloom-pink-light focus:outline-none focus:border-bloom-pink font-lato text-bloom-dark resize-none leading-relaxed" placeholder="Spill..." />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-bloom-pink-light">
                  <label className="font-lato font-bold text-sm text-bloom-dark">Would recommend?</label>
                  <button type="button" onClick={() => setWouldRecommend(!wouldRecommend)} className={`w-14 h-8 rounded-full p-1 transition-colors ${wouldRecommend ? 'bg-bloom-pink-deep' : 'bg-bloom-pink-light'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${wouldRecommend ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={createReview.isPending || !subject || !reviewText}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-pink to-bloom-lavender text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(201,184,232,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4"
                >
                  {createReview.isPending ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function ReviewCard({ review, delay }: { review: any, delay: number }) {
  const getVibeColor = (v: string) => {
    switch (v) {
      case 'immaculate': return 'bg-bloom-sage-lt text-[#527A4A]';
      case 'solid': return 'bg-bloom-blue-lt text-[#366898]';
      case 'mid': return 'bg-bloom-butter-lt text-[#C9A430]';
      case 'not it': return 'bg-bloom-pink text-white';
      case 'chaotic good': return 'bg-bloom-lavender-lt text-[#8A6BC0]';
      default: return 'bg-bloom-cream text-bloom-soft';
    }
  };

  // Seeded slight rotation based on ID
  const getRotation = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return (Math.abs(hash) % 4) - 2;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 200 }}
      style={{ rotate: `${getRotation(review.id)}deg` }}
      className="p-5 rounded-[12px] bg-[#FAFAF7] shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative border border-[#F0F0EB] overflow-hidden"
    >
      {/* Subtle Noise Texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {/* Tape mockup at top */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/40 shadow-sm border border-black/5 rotate-[-2deg] z-10" />

      <div className="flex justify-between items-start mb-3 relative z-10 pt-2">
        <h3 className="font-playfair italic text-[18px] text-bloom-dark leading-tight max-w-[70%]">{review.subject}</h3>
        {review.vibeCheck && (
          <div className={`px-2.5 py-1 rounded-full font-lato font-bold text-[9px] uppercase tracking-wider ${getVibeColor(review.vibeCheck)}`}>
            {review.vibeCheck}
          </div>
        )}
      </div>

      {review.rating > 0 && (
        <div className="flex gap-1 mb-3 relative z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < review.rating ? 'bg-bloom-text-mid' : 'bg-bloom-text-soft/20'}`} />
          ))}
        </div>
      )}

      <p className="font-lato font-light text-bloom-dark text-[15px] leading-relaxed line-clamp-2 mb-4 relative z-10">
        "{review.review}"
      </p>

      <div className="flex justify-between items-center pt-3 border-t border-[#F0F0EB] relative z-10">
        {review.category ? (
          <span className="font-caveat text-[16px] text-bloom-soft">{review.category}</span>
        ) : <div />}
        {review.date && (
          <span className="font-lato text-[11px] text-bloom-soft/70 uppercase tracking-widest">{format(new Date(review.date), "MMM d, yyyy")}</span>
        )}
      </div>
    </motion.div>
  );
}
