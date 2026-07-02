import { useState } from "react";
import { useListMemories, useToggleMemoryFavorite, useCreateMemory, useDeleteMemory, getListMemoriesQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Heart, Search, Play, Plus, X, Image as ImageIcon } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";

export default function MemoryWall() {
  const [filter, setFilter] = useState<"All" | "Favorites" | "Photos" | "Videos">("All");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: memories, isLoading } = useListMemories({
    favorite: filter === "Favorites" ? "true" : undefined,
    search: search.length > 2 ? search : undefined,
  });

  const toggleFavorite = useToggleMemoryFavorite({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
      }
    }
  });

  const createMemory = useCreateMemory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Memory added", description: "Your memory has been saved." });
      }
    }
  });

  const deleteMemory = useDeleteMemory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMemoriesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setViewOpen(false);
        toast({ title: "Memory deleted" });
      }
    }
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setMediaUrl("");
    setMediaType("image");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createMemory.mutate({
      data: {
        title,
        description,
        date,
        mediaUrl,
        mediaType,
        isFavorite: false
      }
    });
  };

  const filteredMemories = memories?.filter(m => {
    if (filter === "Photos") return m.mediaType === "image";
    if (filter === "Videos") return m.mediaType === "video";
    return true;
  }) || [];

  const leftCol = filteredMemories.filter((_, i) => i % 2 === 0);
  const rightCol = filteredMemories.filter((_, i) => i % 2 !== 0);

  const selectedMemory = memories?.find(m => m.id === selectedMemoryId);

  // seeded random rotation
  const getRotation = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return (Math.abs(hash) % 8) - 4;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-10 px-5 min-h-[100dvh]"
    >
      <header className="mb-6">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight">Memory Wall</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">every moment, kept forever</p>
      </header>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-bloom-pink-deep" />
          </div>
          <input
            type="text"
            placeholder="Search memories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-full border border-bloom-pink focus:outline-none focus:ring-2 focus:ring-bloom-pink-light bg-white/50 font-lato text-sm text-bloom-dark placeholder:text-bloom-soft"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x hide-scrollbar">
          {["All", "Favorites", "Photos", "Videos"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-lato transition-all snap-start flex-shrink-0 ${
                filter === f 
                  ? "bg-bloom-pink-deep text-white shadow-[0_2px_8px_rgba(232,160,176,0.3)]" 
                  : "bg-white border border-bloom-pink-light text-bloom-text-mid"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-pink-light border-t-bloom-pink-deep rounded-full animate-spin" />
        </div>
      ) : filteredMemories.length === 0 ? (
        <EmptyState message="Your first bloom is waiting" />
      ) : (
        <div className="flex gap-3 items-start pb-6">
          <div className="flex-1 space-y-3">
            {leftCol.map((memory, i) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                rotation={getRotation(memory.id)}
                delay={i * 0.06}
                onToggleFavorite={() => toggleFavorite.mutate({ id: memory.id })}
                onClick={() => { setSelectedMemoryId(memory.id); setViewOpen(true); }}
              />
            ))}
          </div>
          <div className="flex-1 space-y-3 pt-6">
            {rightCol.map((memory, i) => (
              <MemoryCard 
                key={memory.id} 
                memory={memory} 
                rotation={getRotation(memory.id)}
                delay={i * 0.06}
                onToggleFavorite={() => toggleFavorite.mutate({ id: memory.id })}
                onClick={() => { setSelectedMemoryId(memory.id); setViewOpen(true); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#F2C4CE] to-[#E8A0B0] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(232,160,176,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-memory"
      >
        <Plus size={28} />
      </button>

      {/* View Drawer */}
      <Drawer.Root open={viewOpen} onOpenChange={setViewOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="bg-bloom-cream flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-pink-deep/30 my-4" />
            <div className="overflow-y-auto pb-10">
              {selectedMemory?.mediaUrl && (
                <div className="w-full relative">
                  {selectedMemory.mediaType === "video" ? (
                    <div className="w-full aspect-video bg-black flex items-center justify-center">
                      <Play size={48} className="text-white opacity-80" />
                    </div>
                  ) : (
                    <img src={selectedMemory.mediaUrl} alt={selectedMemory.title} className="w-full h-auto max-h-[60vh] object-cover" />
                  )}
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-playfair italic text-3xl text-bloom-dark">{selectedMemory?.title}</h2>
                  <button 
                    onClick={() => {
                      if (selectedMemory) toggleFavorite.mutate({ id: selectedMemory.id });
                    }}
                    className="p-2"
                  >
                    <Heart size={24} fill={selectedMemory?.isFavorite ? "#E8A0B0" : "transparent"} color={selectedMemory?.isFavorite ? "#E8A0B0" : "#A0827A"} className={selectedMemory?.isFavorite ? "scale-110 transition-transform" : ""} />
                  </button>
                </div>
                {selectedMemory?.date && <p className="font-lato text-sm text-bloom-soft mb-4">{format(new Date(selectedMemory.date), "d MMMM yyyy")}</p>}
                {selectedMemory?.description && (
                  <p className="font-lato text-bloom-mid leading-relaxed">{selectedMemory.description}</p>
                )}
                
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => {
                      if (selectedMemory && confirm("Delete this memory?")) {
                        deleteMemory.mutate({ id: selectedMemory.id });
                      }
                    }}
                    className="flex-1 py-3 rounded-full border border-red-200 text-red-500 font-lato font-bold active:scale-95 transition-transform"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="diary-page flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-pink-deep/30 my-4" />
            <div className="px-6 pb-4 pt-2 flex justify-between items-start">
              <div>
                <div className="font-caveat text-bloom-soft text-lg">{format(new Date(date), "d MMMM yyyy")}</div>
                <h2 className="font-playfair italic text-2xl text-bloom-dark">a new memory</h2>
              </div>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white/60 rounded-full text-bloom-soft mt-1">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-1">
                  <label className="diary-label">what happened?</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full h-10 diary-field font-lato text-bloom-dark text-[16px]"
                    placeholder="Give this memory a name..." />
                </div>

                <div className="space-y-1">
                  <label className="diary-label">when was it?</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full h-10 diary-field font-lato text-bloom-dark" />
                </div>

                <div className="space-y-1">
                  <label className="diary-label">photo or video</label>
                  <FileUpload
                    value={mediaUrl}
                    mediaType={mediaType as "image" | "video"}
                    onChange={(url, type) => { setMediaUrl(url); setMediaType(type); }}
                    onClear={() => setMediaUrl("")}
                    accept="both"
                  />
                </div>

                <div className="space-y-1">
                  <label className="diary-label">tell the story...</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full h-36 px-1 py-1 diary-textarea font-lato text-bloom-dark resize-none focus:outline-none"
                    placeholder="what do you want to remember about this?" />
                </div>

                <button
                  type="submit"
                  disabled={createMemory.isPending || !title}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#F2C4CE] to-[#E8A0B0] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(232,160,176,0.35)] active:scale-95 transition-transform disabled:opacity-50"
                >
                  {createMemory.isPending ? "Saving..." : "Write it down"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function MemoryCard({ memory, rotation, delay, onToggleFavorite, onClick }: { memory: any, rotation: number, delay: number, onToggleFavorite: () => void, onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      style={{ rotate: `${rotation}deg` }}
      whileHover={{ rotate: "0deg", scale: 1.02 }}
      className="polaroid rounded-sm relative cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full aspect-[4/3] bg-bloom-pink-light rounded-sm overflow-hidden mb-3 relative">
        {memory.mediaUrl ? (
          memory.mediaType === "video" ? (
            <div className="w-full h-full bg-black/10 flex items-center justify-center relative">
              <img src={memory.mediaUrl} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50" />
              <Play fill="white" className="text-white z-10 w-8 h-8 opacity-80" />
            </div>
          ) : (
            <img src={memory.mediaUrl} alt={memory.title} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="text-bloom-pink-deep/30 w-8 h-8" />
          </div>
        )}
      </div>
      
      <div className="px-1">
        <h3 className="font-caveat text-[18px] text-bloom-dark leading-tight">{memory.title}</h3>
        {memory.date && <p className="font-lato font-light text-[10px] text-bloom-soft mt-1">{format(new Date(memory.date), "d MMM yyyy")}</p>}
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute bottom-3 right-3 p-1"
      >
        <motion.div
          animate={memory.isFavorite ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart size={18} fill={memory.isFavorite ? "#E8A0B0" : "transparent"} color={memory.isFavorite ? "#E8A0B0" : "#A0827A"} />
        </motion.div>
      </button>
    </motion.div>
  );
}
