import { useState } from "react";
import { useListBooks, useCreateBook, getListBooksQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Book as BookIcon, Plus, Star, X } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";

export default function Bookshelf() {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useListBooks();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("want_to_read");
  const [rating, setRating] = useState<number>(0);
  const [quote, setQuote] = useState("");
  const [reflection, setReflection] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isStayed, setIsStayed] = useState(false);

  const createBook = useCreateBook({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBooksQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Book added to shelf" });
      }
    }
  });

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setStatus("want_to_read");
    setRating(0);
    setQuote("");
    setReflection("");
    setCoverUrl("");
    setIsStayed(false);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    createBook.mutate({
      data: {
        title,
        author,
        status,
        rating,
        quote,
        reflection,
        coverUrl,
        isStayed
      }
    });
  };

  const stayedBooks = books?.filter(b => b.isStayed) || [];
  const currentlyReading = books?.filter(b => b.status === "reading") || [];
  const readBooks = books?.filter(b => b.status === "read") || [];
  const wantToRead = books?.filter(b => b.status === "want_to_read") || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-10 min-h-[100dvh]"
    >
      <header className="mb-6 px-5">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight bg-gradient-to-r from-bloom-lavender to-[#A68FDF] text-transparent bg-clip-text">Bookshelf</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">everything she's ever read</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-lavender-lt border-t-bloom-lavender rounded-full animate-spin" />
        </div>
      ) : !books || books.length === 0 ? (
        <EmptyState message="The shelf is bare — what are you reading?" />
      ) : (
        <div className="space-y-8 pb-6">
          {stayedBooks.length > 0 && (
            <div className="bg-bloom-lavender-lt/50 py-6 relative">
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(201,184,232,0.3)] pointer-events-none" />
              <h2 className="font-caveat text-[22px] text-[#8A6BC0] px-5 mb-4">Books That Stayed</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 px-5 snap-x hide-scrollbar">
                {stayedBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} delay={i * 0.05} tall />
                ))}
              </div>
            </div>
          )}

          <Shelf title="Currently Reading" books={currentlyReading} />
          <Shelf title="Read" books={readBooks} />
          <Shelf title="Want to Read" books={wantToRead} />
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-lavender to-[#B29CD9] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(201,184,232,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-book"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="diary-page flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-lavender/60 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Book</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white/60 rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="diary-label">Title *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 diary-field font-lato text-bloom-dark text-[16px]" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Author</label>
                  <input value={author} onChange={e => setAuthor(e.target.value)} className="w-full h-10 diary-field font-lato text-bloom-dark text-[16px]" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="diary-label">Cover URL</label>
                  <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="w-full h-10 diary-field font-lato text-bloom-dark text-[16px]" placeholder="https://..." />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Status</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStatus("want_to_read")} className={`flex-1 py-3 rounded-[14px] font-lato text-xs font-bold transition-all ${status === 'want_to_read' ? 'bg-bloom-lavender text-[#8A6BC0] shadow-sm' : 'bg-white text-bloom-soft border border-bloom-lavender-lt'}`}>Want to</button>
                    <button type="button" onClick={() => setStatus("reading")} className={`flex-1 py-3 rounded-[14px] font-lato text-xs font-bold transition-all ${status === 'reading' ? 'bg-bloom-lavender text-[#8A6BC0] shadow-sm' : 'bg-white text-bloom-soft border border-bloom-lavender-lt'}`}>Reading</button>
                    <button type="button" onClick={() => setStatus("read")} className={`flex-1 py-3 rounded-[14px] font-lato text-xs font-bold transition-all ${status === 'read' ? 'bg-bloom-lavender text-[#8A6BC0] shadow-sm' : 'bg-white text-bloom-soft border border-bloom-lavender-lt'}`}>Read</button>
                  </div>
                </div>

                {status === "read" && (
                  <div className="space-y-1.5 animate-in fade-in zoom-in duration-300">
                    <label className="diary-label">Rating</label>
                    <div className="flex gap-2 h-12 items-center px-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="active:scale-90 transition-transform p-1">
                          <Star size={28} fill={star <= rating ? "#8A6BC0" : "transparent"} color={star <= rating ? "#8A6BC0" : "var(--bloom-lavender-lt)"} strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-bloom-lavender-lt">
                  <label className="font-lato font-bold text-sm text-bloom-dark">Stayed with you?</label>
                  <button type="button" onClick={() => setIsStayed(!isStayed)} className={`w-14 h-8 rounded-full p-1 transition-colors ${isStayed ? 'bg-[#8A6BC0]' : 'bg-bloom-lavender-lt'}`}>
                    <div className={`w-6 h-6 rounded-full bg-white transition-transform ${isStayed ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Favorite Quote</label>
                  <textarea value={quote} onChange={e => setQuote(e.target.value)} className="w-full h-20 p-4 rounded-[14px] bg-white border border-bloom-lavender-lt focus:outline-none focus:border-bloom-lavender font-lato italic text-bloom-dark resize-none" placeholder='"..."' />
                </div>

                <div className="space-y-1.5">
                  <label className="diary-label">Reflection</label>
                  <textarea value={reflection} onChange={e => setReflection(e.target.value)} className="w-full h-24 p-4 rounded-[14px] bg-white border border-bloom-lavender-lt focus:outline-none focus:border-bloom-lavender font-lato text-bloom-dark resize-none" placeholder="Thoughts after reading..." />
                </div>

                <button 
                  type="submit" 
                  disabled={createBook.isPending || !title}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-lavender to-[#B29CD9] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(201,184,232,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4"
                >
                  {createBook.isPending ? "Adding..." : "Add to Shelf"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function Shelf({ title, books }: { title: string, books: any[] }) {
  if (books.length === 0) return null;
  
  return (
    <div className="px-5">
      <h2 className="font-caveat text-xl text-bloom-soft mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x hide-scrollbar">
        {books.map((book, i) => (
          <BookCard key={book.id} book={book} delay={i * 0.05} />
        ))}
      </div>
      <div className="h-2 bg-[#EAE0D5] rounded-full mx-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] opacity-50" />
    </div>
  );
}

function BookCard({ book, delay, tall = false }: { book: any, delay: number, tall?: boolean }) {
  const width = tall ? "w-[120px]" : "w-[100px]";
  const height = tall ? "aspect-[2/3]" : "aspect-[3/4]";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      className={`snap-start flex-shrink-0 flex flex-col ${width} cursor-pointer active:scale-95 transition-transform`}
    >
      <div className={`w-full ${height} bg-bloom-lavender-lt rounded-r-md rounded-l-sm overflow-hidden mb-2 relative shadow-[4px_4px_12px_rgba(0,0,0,0.1)] border-l-[3px] border-l-white/40`}>
        {book.coverUrl ? (
          <img src={book.coverUrl} className="w-full h-full object-cover" alt={book.title} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bloom-lavender-lt to-bloom-lavender/50 px-2 text-center">
            <span className="font-playfair italic text-[12px] text-[#8A6BC0] opacity-60 leading-tight">{book.title}</span>
          </div>
        )}
      </div>
      
      <div className="px-1">
        <h3 className="font-lato font-bold text-[12px] text-bloom-dark leading-tight line-clamp-2">{book.title}</h3>
        {book.author && <p className="font-lato font-light text-[10px] text-bloom-soft mt-0.5 line-clamp-1">{book.author}</p>}
        {book.status === "read" && book.rating && (
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < book.rating ? 'bg-[#8A6BC0]' : 'bg-bloom-lavender-lt'}`} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
