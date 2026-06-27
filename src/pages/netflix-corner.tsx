import { useState } from "react";
import { useListMovies, useCreateMovie, getListMoviesQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Film, Plus, Star, X } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";

export default function NetflixCorner() {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: movies, isLoading } = useListMovies();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [whatItReminded, setWhatItReminded] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  const createMovie = useCreateMovie({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMoviesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Added to your corner" });
      }
    }
  });

  const resetForm = () => {
    setTitle("");
    setType("movie");
    setGenre("");
    setRating(0);
    setWhatItReminded("");
    setPosterUrl("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createMovie.mutate({
      data: {
        title,
        type,
        genre,
        rating,
        whatItReminded,
        posterUrl
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
      <header className="mb-8">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight bg-gradient-to-r from-[#D8B43B] to-bloom-butter text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(216,180,59,0.2)]">Netflix Corner</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">what we watched, what we felt</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-butter-lt border-t-bloom-butter rounded-full animate-spin" />
        </div>
      ) : !movies || movies.length === 0 ? (
        <EmptyState message="Nothing here yet — what's next on the list?" />
      ) : (
        <div className="grid grid-cols-2 gap-4 pb-6">
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie} delay={i * 0.05} />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-butter to-[#D8B43B] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(216,180,59,0.4)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-movie"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="diary-page flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-butter/60 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Watch</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white/60 rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="diary-label">Title *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-butter-lt focus:outline-none focus:border-bloom-butter font-lato text-bloom-dark" />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setType("movie")} className={`flex-1 py-3 rounded-[14px] font-lato text-xs font-bold transition-all ${type === 'movie' ? 'bg-bloom-butter text-[#C9A430] shadow-sm' : 'bg-white text-bloom-soft border border-bloom-butter-lt'}`}>Movie</button>
                    <button type="button" onClick={() => setType("series")} className={`flex-1 py-3 rounded-[14px] font-lato text-xs font-bold transition-all ${type === 'series' ? 'bg-bloom-butter text-[#C9A430] shadow-sm' : 'bg-white text-bloom-soft border border-bloom-butter-lt'}`}>Series</button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Genre</label>
                  <input value={genre} onChange={e => setGenre(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-butter-lt focus:outline-none focus:border-bloom-butter font-lato text-bloom-dark" placeholder="Cozy, Thriller, Rom-Com..." />
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Poster URL</label>
                  <input value={posterUrl} onChange={e => setPosterUrl(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-butter-lt focus:outline-none focus:border-bloom-butter font-lato text-bloom-dark" placeholder="https://..." />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Rating</label>
                  <div className="flex gap-2 h-12 items-center px-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform p-1">
                        <Star size={28} fill={star <= rating ? "#C9A430" : "transparent"} color={star <= rating ? "#C9A430" : "var(--bloom-butter-lt)"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">What it reminded me of</label>
                  <textarea value={whatItReminded} onChange={e => setWhatItReminded(e.target.value)} className="w-full h-24 p-4 rounded-[14px] bg-white border border-bloom-butter-lt focus:outline-none focus:border-bloom-butter font-lato text-bloom-dark resize-none" placeholder="Felt just like..." />
                </div>

                <button 
                  type="submit" 
                  disabled={createMovie.isPending || !title}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-butter to-[#D8B43B] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(216,180,59,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4"
                >
                  {createMovie.isPending ? "Adding..." : "Add to Corner"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function MovieCard({ movie, delay }: { movie: any, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col cursor-pointer active:scale-95 transition-transform group"
    >
      <div className="w-full aspect-[2/3] rounded-[16px] overflow-hidden relative shadow-[0_8px_16px_rgba(0,0,0,0.1)] mb-3 bg-bloom-butter-lt">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="text-bloom-butter w-12 h-12" />
          </div>
        )}
        
        {/* Gradient overlay for title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
          <h3 className="font-playfair italic font-bold text-white text-[16px] leading-tight drop-shadow-md">{movie.title}</h3>
        </div>

        {/* Badge */}
        {movie.type && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-lato font-bold text-[9px] uppercase tracking-wider">
            {movie.type}
          </div>
        )}
      </div>

      <div className="px-1 flex flex-col flex-1">
        {movie.rating && (
          <div className="flex gap-0.5 mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill={i < movie.rating ? "#C9A430" : "transparent"} color={i < movie.rating ? "#C9A430" : "var(--bloom-butter)"} strokeWidth={2} />
            ))}
          </div>
        )}
        
        {movie.whatItReminded && (
          <p className="font-lato italic font-light text-[11px] text-bloom-mid leading-snug line-clamp-2">"{movie.whatItReminded}"</p>
        )}
      </div>
    </motion.div>
  );
}
