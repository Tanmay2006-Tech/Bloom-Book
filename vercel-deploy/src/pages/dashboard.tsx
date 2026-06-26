import { useGetStats, useGetTimeline } from "@/lib/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ImageIcon, Coffee, Book, Film, Utensils, MessageCircle, Star, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: timeline, isLoading: timelineLoading } = useGetTimeline();

  const today = format(new Date(), "EEEE, d MMMM");

  const statCards = [
    { id: "memories", label: "memories", count: stats?.memories || 0, icon: ImageIcon, color: "text-[#E8A0B0]", bg: "bg-bloom-pink-light" },
    { id: "cafes", label: "cafes", count: stats?.cafes || 0, icon: Coffee, color: "text-[#C9814D]", bg: "bg-bloom-peach-lt" },
    { id: "books", label: "books", count: stats?.books || 0, icon: Book, color: "text-[#8A6BC0]", bg: "bg-bloom-lavender-lt" },
    { id: "movies", label: "movies", count: stats?.movies || 0, icon: Film, color: "text-[#C9A430]", bg: "bg-bloom-butter-lt" },
    { id: "kitchen", label: "kitchen", count: stats?.kitchen || 0, icon: Utensils, color: "text-[#C9814D]", bg: "bg-bloom-peach-lt" },
    { id: "reviews", label: "reviews", count: stats?.reviews || 0, icon: MessageCircle, color: "text-[#E8A0B0]", bg: "bg-bloom-pink-light" },
    { id: "wishes", label: "wishes", count: stats?.wishes || 0, icon: Star, color: "text-[#8A6BC0]", bg: "bg-bloom-lavender-lt" },
  ];

  const getSectionColor = (section: string) => {
    const sectionMap: Record<string, string> = {
      memories: "#E8A0B0",
      cafes: "#C9814D",
      books: "#8A6BC0",
      movies: "#C9A430",
      kitchen: "#638A5A",
      reviews: "#E8A0B0",
      wishes: "#598BBF",
      capsules: "#598BBF"
    };
    return sectionMap[section] || "#A0827A";
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'memories': return <ImageIcon size={14} />;
      case 'cafes': return <Coffee size={14} />;
      case 'books': return <Book size={14} />;
      case 'movies': return <Film size={14} />;
      case 'kitchen': return <Utensils size={14} />;
      case 'reviews': return <MessageCircle size={14} />;
      case 'wishes': return <Star size={14} />;
      case 'capsules': return <Sparkles size={14} />;
      default: return <Star size={14} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pt-12 px-5"
    >
      <header className="mb-8">
        <span className="font-lato font-light text-bloom-soft text-sm tracking-wide">your little world</span>
        <h1 className="font-playfair italic text-[38px] text-bloom-dark tracking-[-0.02em] leading-tight mt-1">BloomBook</h1>
        <div className="font-lato font-light text-[13px] text-bloom-soft mt-1">{today}</div>
      </header>

      {/* Stats Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 snap-x">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[100px] h-[120px] rounded-[24px] bg-bloom-pink-light/30 flex-shrink-0 animate-pulse snap-start" />
          ))
        ) : (
          statCards.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, duration: 0.4, type: "spring", stiffness: 400, damping: 30 }}
              className={`w-[100px] h-[120px] rounded-[24px] ${stat.bg} flex-shrink-0 flex flex-col items-center justify-center p-4 snap-start shadow-[0_8px_16px_rgba(0,0,0,0.03)]`}
            >
              <div className={`${stat.color} mb-2`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <span className="font-playfair text-[28px] text-bloom-dark leading-none">{stat.count}</span>
              <span className="font-lato font-light text-[11px] text-bloom-soft mt-2">{stat.label}</span>
            </motion.div>
          ))
        )}
      </div>

      {/* Timeline */}
      <section className="mt-10 mb-8">
        <h2 className="font-playfair italic text-[22px] text-bloom-dark mb-6">Recently</h2>
        
        {timelineLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-bloom-pink-light/50" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-bloom-pink-light/50 rounded w-3/4" />
                  <div className="h-3 bg-bloom-pink-light/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !timeline || timeline.length === 0 ? (
          <EmptyState message="Your story starts here" />
        ) : (
          <div className="relative border-l border-dashed border-bloom-pink-deep/30 ml-4 space-y-8 pb-4">
            {timeline.map((item, i) => {
              const color = getSectionColor(item.section);
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="relative pl-6"
                >
                  {/* Timeline dot */}
                  <div 
                    className="absolute -left-[17px] top-1 w-[33px] h-[33px] rounded-full flex items-center justify-center border-4 border-bloom-cream text-white shadow-sm"
                    style={{ backgroundColor: color }}
                  >
                    {getSectionIcon(item.section)}
                  </div>
                  
                  <div className="pt-1">
                    <h3 className="font-lato text-bloom-dark text-[15px] leading-snug">{item.title}</h3>
                    {item.subtitle && <p className="font-lato font-light text-bloom-soft text-[13px] mt-0.5">{item.subtitle}</p>}
                    <p className="font-lato font-light text-bloom-soft/70 text-[11px] mt-1.5 uppercase tracking-wider">
                      {item.section} • {format(new Date(item.createdAt), "MMM d")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}
