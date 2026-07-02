import { useGetStats, useGetTimeline } from "@/lib/api";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ImageIcon, Coffee, Book, Film, Utensils, MessageCircle, Star, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FlowerCluster } from "@/components/floral-deco";

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
      <header className="mb-8 relative">
        {/* Washi tape */}
        <div className="absolute -top-5 left-2 w-20 h-5 rounded-sm"
          style={{ background: "linear-gradient(90deg,#F2C4CE,#FAE8EE)", opacity: 0.55, transform: "rotate(-1deg)" }} />

        <div className="font-caveat text-[22px] text-bloom-soft/60 mt-1">every little moment, kept safe</div>
        <div className="flex items-center gap-2 mt-0.5">
          <h1 className="font-playfair italic text-[38px] text-bloom-dark tracking-[-0.02em] leading-tight">BloomBook</h1>
          <svg className="opacity-25 mb-1" width="18" height="18" viewBox="0 0 40 40" fill="none">
            <ellipse cx="20" cy="26" rx="9" ry="7" fill="#E8A0B0" />
            <ellipse cx="11" cy="17" rx="4" ry="5" fill="#E8A0B0" />
            <ellipse cx="20" cy="14" rx="4" ry="5" fill="#E8A0B0" />
            <ellipse cx="29" cy="17" rx="4" ry="5" fill="#E8A0B0" />
          </svg>
        </div>
        <div className="font-caveat text-lg text-bloom-soft mt-0.5">{today}</div>
        {/* Floral cluster decoration */}
        <div className="absolute top-0 right-0 pointer-events-none">
          <FlowerCluster className="w-[130px] h-[52px] opacity-55" />
        </div>
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
              className={`w-[100px] flex-shrink-0 snap-start`}
              style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i % 3) * 0.8}deg)` }}
            >
              {/* Washi tape on top */}
              <div className="mx-auto w-10 h-3 rounded-sm mb-[-6px] relative z-10"
                style={{ background: i % 3 === 0 ? "#F2C4CE" : i % 3 === 1 ? "#C9B8E8" : "#A8C8E8", opacity: 0.65 }} />
              <div className={`diary-card rounded-[16px] ${stat.bg} flex flex-col items-center justify-center p-4 pt-5 h-[116px]`}>
                <div className={`${stat.color} mb-1.5`}>
                  <stat.icon size={18} strokeWidth={2.5} />
                </div>
                <span className="font-playfair text-[28px] text-bloom-dark leading-none">{stat.count}</span>
                <span className="font-caveat text-[13px] text-bloom-soft mt-1.5">{stat.label}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Botanical separator */}
      <div className="flex items-center gap-3 my-8 -mx-1">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-bloom-pink-deep/25 to-transparent" />
        <div className="flex items-center gap-1.5 opacity-40">
          {["#E8A0B0","#C9B8E8","#A8C8E8","#C9B8E8","#E8A0B0"].map((c, i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 36 36" fill="none">
              <ellipse cx="18" cy="18" rx="4" ry="8" fill={c} />
              <ellipse cx="18" cy="18" rx="4" ry="8" fill={c} transform="rotate(60 18 18)" />
              <ellipse cx="18" cy="18" rx="4" ry="8" fill={c} opacity="0.6" transform="rotate(120 18 18)" />
              <circle cx="18" cy="18" r="3" fill="#F5E6A3" />
            </svg>
          ))}
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-bloom-pink-deep/25 to-transparent" />
      </div>

      {/* Timeline */}
      <section className="mb-8">
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
