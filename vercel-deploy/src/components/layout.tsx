import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Drawer } from "vaul";
import { Home, Image as ImageIcon, Coffee, Utensils, Grid, Plus, Book, Film, Star, Mail, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Wall", path: "/wall", icon: ImageIcon },
    { name: "Cafe", path: "/cafes", icon: Coffee },
    { name: "Kitchen", path: "/kitchen", icon: Utensils },
  ];

  const moreItems = [
    { name: "Books", path: "/books", icon: Book, color: "bg-bloom-lavender-lt text-[#8A6BC0]" },
    { name: "Movies", path: "/movies", icon: Film, color: "bg-bloom-butter-lt text-[#C9A430]" },
    { name: "Someday", path: "/someday", icon: Star, color: "bg-bloom-pink-light text-[#C75A74]" },
    { name: "Capsules", path: "/capsules", icon: Mail, color: "bg-bloom-blue-lt text-[#598BBF]" },
    { name: "Reviews", path: "/reviews", icon: MessageCircle, color: "bg-bloom-peach-lt text-[#C9814D]" },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] w-full max-w-[480px] mx-auto bg-bloom-cream relative overflow-hidden shadow-2xl pb-[88px]">
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* FAB - Will be overridden by individual pages if they need a specific FAB action, 
          but we provide a global placeholder here for architecture if needed, though pages usually implement their own.
          Actually, the spec says "Floating action button" on most pages. We'll let pages render it themselves to handle their own modals.
      */}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full max-w-[480px] h-[64px] pb-safe flex items-center justify-around px-2 backdrop-blur-[20px] bg-[rgba(255,248,240,0.85)] border-t border-[rgba(242,196,206,0.3)] z-40">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.name} href={item.path} className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform" data-testid={`nav-${item.name.toLowerCase()}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-bloom-pink-deep" : "text-bloom-text-soft"} />
              <span className={`text-[10px] font-lato ${isActive ? "text-bloom-pink-deep font-bold" : "text-bloom-text-soft font-normal"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        <button 
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform"
          data-testid="nav-more"
        >
          <Grid size={24} strokeWidth={2} className="text-bloom-text-soft" />
          <span className="text-[10px] font-lato text-bloom-text-soft">More</span>
        </button>
      </div>

      {/* More Drawer */}
      <Drawer.Root open={moreOpen} onOpenChange={setMoreOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="bg-bloom-cream flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh]">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-pink-deep/30 my-4" />
            <div className="px-6 pb-12 pt-2">
              <h2 className="font-playfair italic text-2xl text-bloom-dark mb-6">More Places</h2>
              <div className="grid grid-cols-4 gap-y-8 gap-x-2">
                {moreItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setLocation(item.path);
                      setMoreOpen(false);
                    }}
                    className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
                    data-testid={`more-nav-${item.name.toLowerCase()}`}
                  >
                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center ${item.color}`}>
                      <item.icon size={26} strokeWidth={1.5} />
                    </div>
                    <span className="font-lato font-bold text-xs text-bloom-text-mid">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
