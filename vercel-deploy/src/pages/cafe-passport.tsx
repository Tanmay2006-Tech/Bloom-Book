import { useState } from "react";
import { useListCafes, useCreateCafe, useDeleteCafe, getListCafesQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Coffee, MapPin, Star, Check, X, Plus } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";

export default function CafePassport() {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cafes, isLoading } = useListCafes();

  // Add Form State
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [rating, setRating] = useState<number>(5);
  const [whatWeAte, setWhatWeAte] = useState("");
  const [reflection, setReflection] = useState("");
  const [wouldVisitAgain, setWouldVisitAgain] = useState(true);

  const createCafe = useCreateCafe({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCafesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Stamp added to passport" });
      }
    }
  });

  const resetForm = () => {
    setName("");
    setLocation("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setRating(5);
    setWhatWeAte("");
    setReflection("");
    setWouldVisitAgain(true);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    createCafe.mutate({
      data: {
        name,
        location,
        date,
        rating,
        whatWeAte,
        reflection,
        wouldVisitAgain
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-10 px-5 min-h-[100dvh]"
    >
      <header className="mb-8 p-6 rounded-[20px] bg-gradient-to-br from-bloom-peach-lt to-bloom-butter-lt shadow-[0_8px_24px_rgba(245,198,160,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10" />
        <h1 className="font-playfair italic text-[32px] text-bloom-dark relative z-10">Cafe Passport</h1>
        <p className="font-caveat text-xl text-bloom-mid mt-1 relative z-10">every cup has a story</p>
        
        {cafes && cafes.length > 0 && (
          <div className="absolute top-6 right-6 bg-bloom-peach text-white px-3 py-1 rounded-full font-lato font-bold text-xs shadow-sm">
            {cafes.length} Stamps
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-peach-lt border-t-bloom-peach rounded-full animate-spin" />
        </div>
      ) : !cafes || cafes.length === 0 ? (
        <EmptyState message="No stamps yet — where did you go first?" />
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-6">
          {cafes.map((cafe, i) => (
            <CafeCard key={cafe.id} cafe={cafe} delay={i * 0.06} />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-peach to-[#ECA87B] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(245,198,160,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-cafe"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="diary-page flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-peach/40 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Stamp</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white/60 rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="diary-label">Cafe Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark" placeholder="The little corner shop..." />
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark" placeholder="City, neighborhood..." />
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark" />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Rating</label>
                  <div className="flex gap-2 h-12 items-center px-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform p-1">
                        <Star size={28} fill={star <= rating ? "var(--bloom-butter)" : "transparent"} color={star <= rating ? "var(--bloom-butter)" : "var(--bloom-peach-lt)"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">What we ate</label>
                  <textarea value={whatWeAte} onChange={e => setWhatWeAte(e.target.value)} className="w-full h-20 p-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark resize-none" placeholder="Almond croissant and matcha latte..." />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Reflection</label>
                  <textarea value={reflection} onChange={e => setReflection(e.target.value)} className="w-full h-24 p-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark resize-none" placeholder="Loved the natural light..." />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-bloom-peach-lt">
                  <label className="font-lato font-bold text-sm text-bloom-dark">Would visit again?</label>
                  <button type="button" onClick={() => setWouldVisitAgain(!wouldVisitAgain)} className={`w-14 h-8 rounded-full p-1 transition-colors ${wouldVisitAgain ? 'bg-bloom-peach' : 'bg-bloom-peach-lt'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${wouldVisitAgain ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={createCafe.isPending || !name}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-peach to-[#ECA87B] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(245,198,160,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4"
                >
                  {createCafe.isPending ? "Stamping..." : "Add Stamp"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function CafeCard({ cafe, delay }: { cafe: any, delay: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="perspective-1000 w-full aspect-square cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div 
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden bg-bloom-peach-lt rounded-[20px] p-4 flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(245,198,160,0.2)] overflow-hidden">
          <div className="absolute top-2 right-2 w-10 h-10 border-2 border-dashed border-bloom-peach/40 rounded-full flex items-center justify-center opacity-80 rotate-12">
            <span className="font-lato font-bold text-[10px] text-bloom-peach text-center leading-none px-1">
              {cafe.rating}<br/><span className="text-[8px]">★</span>
            </span>
          </div>

          <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center mb-3 text-bloom-peach">
            <Coffee size={28} strokeWidth={1.5} />
          </div>
          
          <h3 className="font-playfair font-bold text-center text-bloom-dark text-[16px] leading-tight mb-1 px-1 line-clamp-2">{cafe.name}</h3>
          
          {cafe.location && (
            <div className="flex items-center gap-1 text-bloom-soft mb-1">
              <MapPin size={10} />
              <span className="font-lato text-[11px] truncate max-w-[120px]">{cafe.location}</span>
            </div>
          )}
          
          {cafe.date && <span className="font-lato font-light text-[10px] text-bloom-soft/80 uppercase tracking-wider mt-auto">{format(new Date(cafe.date), "dd.MM.yyyy")}</span>}
          
          {cafe.wouldVisitAgain && (
            <div className="absolute bottom-3 right-3 bg-bloom-peach text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
              <Check size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[20px] p-4 shadow-[0_4px_16px_rgba(245,198,160,0.3)] border border-bloom-peach-lt overflow-hidden flex flex-col" style={{ transform: "rotateY(180deg)" }}>
          <h4 className="font-caveat text-bloom-peach text-lg border-b border-bloom-peach-lt/50 pb-1 mb-2">What we ate:</h4>
          <p className="font-lato text-xs text-bloom-mid line-clamp-3 mb-3">{cafe.whatWeAte || "Nothing noted."}</p>
          
          <h4 className="font-caveat text-bloom-peach text-lg border-b border-bloom-peach-lt/50 pb-1 mb-2">Thoughts:</h4>
          <p className="font-lato text-xs text-bloom-mid line-clamp-3 flex-1">{cafe.reflection || "Just vibes."}</p>

          <div className="flex gap-1 justify-center mt-auto pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} fill={i < (cafe.rating || 0) ? "var(--bloom-peach)" : "transparent"} color="var(--bloom-peach)" />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
