import { useState } from "react";
import { useListKitchenEntries, useCreateKitchenEntry, getListKitchenEntriesQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Utensils, Heart, Star, Plus, X } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";

export default function KitchenDiaries() {
  const [filter, setFilter] = useState<string>("All");
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useListKitchenEntries({
    type: filter !== "All" ? filter.toLowerCase() : undefined,
  });

  const [title, setTitle] = useState("");
  const [type, setType] = useState("cooked");
  const [recipe, setRecipe] = useState("");
  const [mood, setMood] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [wouldMakeAgain, setWouldMakeAgain] = useState(true);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const createEntry = useCreateKitchenEntry({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListKitchenEntriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Kitchen memory added" });
      }
    }
  });

  const resetForm = () => {
    setTitle("");
    setType("cooked");
    setRecipe("");
    setMood("");
    setRating(0);
    setNotes("");
    setPhotoUrl("");
    setWouldMakeAgain(true);
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createEntry.mutate({
      data: {
        title,
        type,
        recipe,
        mood,
        rating,
        notes,
        photoUrl,
        wouldMakeAgain,
        date
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
      <header className="mb-6">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight bg-gradient-to-r from-bloom-peach to-bloom-butter text-transparent bg-clip-text">Kitchen Diaries</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">her little cooking world</p>
      </header>

      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x hide-scrollbar">
          {["All", "Cooked", "Attempted", "Discovered", "Gifted"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-lato transition-all snap-start flex-shrink-0 ${
                filter === f 
                  ? "bg-bloom-peach-lt text-bloom-dark font-bold shadow-sm" 
                  : "bg-white border border-bloom-peach-lt text-bloom-text-mid"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-peach-lt border-t-bloom-peach rounded-full animate-spin" />
        </div>
      ) : !entries || entries.length === 0 ? (
        <EmptyState message="No stories yet — what did you cook?" />
      ) : (
        <div className="space-y-6 pb-6">
          {entries.map((entry, i) => (
            <KitchenCard key={entry.id} entry={entry} delay={i * 0.08} />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-peach to-[#ECA87B] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(245,198,160,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-kitchen"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="diary-page flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90dvh] h-[90dvh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-peach/40 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Recipe</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white/60 rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="diary-label">Dish Name *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark" />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["cooked", "attempted", "discovered", "gifted"].map(t => (
                      <button 
                        key={t} 
                        type="button" 
                        onClick={() => setType(t)} 
                        className={`py-3 rounded-[14px] font-lato text-xs font-bold uppercase tracking-wider transition-all ${type === t ? 'bg-bloom-peach text-white shadow-sm' : 'bg-white text-bloom-soft border border-bloom-peach-lt'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">photo</label>
                  <FileUpload
                    value={photoUrl}
                    mediaType="image"
                    onChange={(url) => setPhotoUrl(url)}
                    onClear={() => setPhotoUrl("")}
                    accept="image"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="diary-label">Rating</label>
                    <div className="flex gap-1 h-12 items-center px-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform p-1">
                          <Star size={24} fill={star <= rating ? "var(--bloom-peach)" : "transparent"} color={star <= rating ? "var(--bloom-peach)" : "var(--bloom-peach-lt)"} strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <label className="diary-label">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Mood</label>
                  <input value={mood} onChange={e => setMood(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-caveat text-xl text-bloom-dark" placeholder="chaotic but happy..." />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Recipe Link or Notes</label>
                  <textarea value={recipe} onChange={e => setRecipe(e.target.value)} className="w-full h-20 p-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark resize-none" placeholder="Where did you find it?" />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Reflection</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-24 p-4 rounded-[14px] bg-white border border-bloom-peach-lt focus:outline-none focus:border-bloom-peach font-lato text-bloom-dark resize-none" placeholder="How did it turn out?" />
                </div>

                <div className="flex items-center justify-between py-2 border-b border-bloom-peach-lt">
                  <label className="font-lato font-bold text-sm text-bloom-dark">Would make again?</label>
                  <button type="button" onClick={() => setWouldMakeAgain(!wouldMakeAgain)} className={`w-14 h-8 rounded-full p-1 transition-colors ${wouldMakeAgain ? 'bg-bloom-peach' : 'bg-bloom-peach-lt'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${wouldMakeAgain ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={createEntry.isPending || !title}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-peach to-[#ECA87B] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(245,198,160,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4"
                >
                  {createEntry.isPending ? "Saving..." : "Save this dish"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function KitchenCard({ entry, delay }: { entry: any, delay: number }) {
  const getTypeColor = (t: string) => {
    switch (t) {
      case 'cooked': return 'bg-bloom-sage text-[#527A4A]';
      case 'attempted': return 'bg-bloom-pink-deep text-white';
      case 'discovered': return 'bg-bloom-butter text-[#C9A430]';
      case 'gifted': return 'bg-bloom-lavender text-[#8A6BC0]';
      default: return 'bg-bloom-peach-lt text-bloom-text-mid';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, rotate: -4, y: 20 }}
      animate={{ opacity: 1, rotate: 0, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white w-full rounded-t-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] relative pb-10"
      style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.05))" }}
    >
      {/* Torn paper edge bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-4 bg-white"
        style={{
          clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%, 100% 100%, 0% 100%)"
        }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 h-3 bg-bloom-cream"
        style={{
          clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%, 100% 100%, 0% 100%)",
          transform: "translateY(3px)"
        }}
      />

      <div className="w-full aspect-[16/9] rounded-t-[16px] bg-bloom-peach-lt overflow-hidden relative">
        {entry.photoUrl ? (
          <img src={entry.photoUrl} alt={entry.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="text-bloom-peach w-10 h-10" />
          </div>
        )}
        
        {entry.type && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full font-lato font-bold text-[10px] uppercase tracking-wider ${getTypeColor(entry.type)}`}>
            {entry.type}
          </div>
        )}
      </div>

      <div className="p-5 relative">
        <h3 className="font-playfair italic font-bold text-[20px] text-bloom-dark leading-tight mb-1 pr-8">{entry.title}</h3>
        
        {entry.wouldMakeAgain && (
          <div className="absolute top-5 right-5 text-bloom-pink-deep">
            <Heart size={20} fill="currentColor" />
          </div>
        )}

        {entry.mood && (
          <p className="font-caveat text-[18px] text-bloom-soft mb-3">"{entry.mood}"</p>
        )}

        {entry.rating > 0 && (
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < entry.rating ? 'bg-bloom-peach' : 'bg-bloom-peach-lt'}`} />
            ))}
          </div>
        )}

        {entry.notes && (
          <p className="font-lato text-sm text-bloom-mid leading-relaxed line-clamp-3 mb-2">{entry.notes}</p>
        )}
        
        {entry.date && <p className="font-lato font-light text-[11px] text-bloom-soft/70 uppercase tracking-wider mt-4">{format(new Date(entry.date), "dd.MM.yyyy")}</p>}
      </div>
    </motion.div>
  );
}
