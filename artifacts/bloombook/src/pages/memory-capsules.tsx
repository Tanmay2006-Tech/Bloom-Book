import { useState } from "react";
import { useListCapsules, useCreateCapsule, useUnlockCapsule, getListCapsulesQueryKey, getGetStatsQueryKey, getGetTimelineQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { Plus, X, Lock } from "lucide-react";
import { Drawer } from "vaul";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";

export default function MemoryCapsules() {
  const [addOpen, setAddOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: capsules, isLoading } = useListCapsules();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [unlockPreset, setUnlockPreset] = useState("1 Year");
  const [customDate, setCustomDate] = useState("");

  const unlockCapsule = useUnlockCapsule({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCapsulesQueryKey() });
        toast({ title: "Capsule unlocked!" });
      }
    }
  });

  const createCapsule = useCreateCapsule({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCapsulesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        setAddOpen(false);
        resetForm();
        toast({ title: "Capsule sealed." });
      }
    }
  });

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setUnlockPreset("1 Year");
    setCustomDate("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    let unlockAtDate = new Date();
    if (unlockPreset === "1 Year") unlockAtDate.setFullYear(unlockAtDate.getFullYear() + 1);
    else if (unlockPreset === "5 Years") unlockAtDate.setFullYear(unlockAtDate.getFullYear() + 5);
    else if (unlockPreset === "10 Years") unlockAtDate.setFullYear(unlockAtDate.getFullYear() + 10);
    else if (unlockPreset === "Custom" && customDate) unlockAtDate = new Date(customDate);

    createCapsule.mutate({
      data: {
        title,
        message,
        unlockAt: unlockAtDate.toISOString()
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
      <header className="mb-10 text-center">
        <h1 className="font-playfair italic text-[32px] text-bloom-dark leading-tight bg-gradient-to-r from-[#87B4E0] to-bloom-blue text-transparent bg-clip-text">Memory Capsules</h1>
        <p className="font-caveat text-xl text-bloom-soft mt-1">letters to your future self</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-bloom-blue-lt border-t-bloom-blue rounded-full animate-spin" />
        </div>
      ) : !capsules || capsules.length === 0 ? (
        <EmptyState message="No letters yet — write to the future" />
      ) : (
        <div className="space-y-6 pb-6">
          {capsules.map((capsule, i) => (
            <CapsuleCard 
              key={capsule.id} 
              capsule={capsule} 
              delay={i * 0.08} 
              onUnlock={() => unlockCapsule.mutate({ id: capsule.id })} 
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-[84px] right-6 w-14 h-14 rounded-full bg-gradient-to-br from-bloom-blue to-[#87B4E0] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(168,200,232,0.5)] z-40 active:scale-90 transition-transform hover:scale-105 animate-[pulse_3s_ease-in-out_infinite]"
        data-testid="fab-add-capsule"
      >
        <Plus size={28} />
      </button>

      {/* Add Drawer */}
      <Drawer.Root open={addOpen} onOpenChange={setAddOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 max-w-[480px] mx-auto" />
          <Drawer.Content className="bg-bloom-cream flex flex-col rounded-t-[28px] fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50 max-h-[90vh] h-[90vh] focus:outline-none">
            <div className="mx-auto w-10 h-1 flex-shrink-0 rounded-full bg-bloom-blue/60 my-4" />
            <div className="px-6 pb-6 pt-2 flex justify-between items-center">
              <h2 className="font-playfair italic text-2xl text-bloom-dark">New Capsule</h2>
              <button onClick={() => setAddOpen(false)} className="p-2 bg-white rounded-full text-bloom-soft">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 overflow-y-auto pb-10">
              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Title *</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full h-14 px-4 rounded-[14px] bg-white border border-bloom-blue-lt focus:outline-none focus:border-bloom-blue font-lato text-bloom-dark text-lg" placeholder="To my 30-year-old self" />
                </div>
                
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">Message *</label>
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} className="w-full h-48 p-4 rounded-[14px] bg-white border border-bloom-blue-lt focus:outline-none focus:border-bloom-blue font-lato text-bloom-dark resize-none leading-relaxed" placeholder="Dear future me..." />
                </div>

                <div className="space-y-3">
                  <label className="font-lato font-bold text-xs uppercase tracking-wider text-bloom-text-mid">When to open</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["1 Year", "5 Years", "10 Years", "Custom"].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => setUnlockPreset(p)} 
                        className={`py-3 rounded-[14px] font-lato text-sm font-bold transition-all ${unlockPreset === p ? 'bg-bloom-blue text-white shadow-sm' : 'bg-white text-bloom-soft border border-bloom-blue-lt'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {unlockPreset === "Custom" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
                      <input type="date" required={unlockPreset === "Custom"} value={customDate} onChange={e => setCustomDate(e.target.value)} className="w-full h-12 px-4 rounded-[14px] bg-white border border-bloom-blue-lt focus:outline-none focus:border-bloom-blue font-lato text-bloom-dark" />
                    </motion.div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={createCapsule.isPending || !title || !message || (unlockPreset === "Custom" && !customDate)}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-bloom-blue to-[#87B4E0] text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(168,200,232,0.4)] active:scale-95 transition-transform disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                >
                  <Lock size={18} />
                  {createCapsule.isPending ? "Sealing..." : "Seal Capsule"}
                </button>
              </form>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </motion.div>
  );
}

function CapsuleCard({ capsule, delay, onUnlock }: { capsule: any, delay: number, onUnlock: () => void }) {
  const now = new Date();
  const unlockAt = new Date(capsule.unlockAt);
  const isReady = unlockAt <= now;
  const isLocked = !capsule.isUnlocked;

  const daysLeft = differenceInDays(unlockAt, now);
  const yearsLeft = Math.floor(daysLeft / 365);
  const remainingText = yearsLeft >= 1 
    ? `Opens in ${yearsLeft} year${yearsLeft > 1 ? 's' : ''}` 
    : `Opens in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`;

  if (capsule.isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-bloom-blue-lt relative overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-bloom-blue-lt flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--bloom-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
              <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
              <path d="m22 10-8.97-5.7a1.94 1.94 0 0 0-2.06 0L2 10"/>
            </svg>
          </div>
          <div>
            <h3 className="font-playfair italic font-bold text-[18px] text-bloom-dark">{capsule.title}</h3>
            <p className="font-lato text-[10px] text-bloom-soft uppercase tracking-wider mt-0.5">Opened {format(new Date(), "dd.MM.yyyy")}</p>
          </div>
        </div>
        <p className="font-lato italic text-bloom-mid leading-relaxed whitespace-pre-wrap">{capsule.message}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`p-8 rounded-[24px] flex flex-col items-center justify-center text-center relative cursor-pointer active:scale-95 transition-transform ${isReady ? 'bg-bloom-cream border-2 border-bloom-blue-lt shadow-[0_0_20px_rgba(168,200,232,0.3)]' : 'bg-bloom-blue-lt shadow-[0_4px_16px_rgba(168,200,232,0.2)]'}`}
      onClick={() => { if (isReady) onUnlock(); }}
    >
      {isReady && (
        <motion.div 
          className="absolute inset-0 bg-white/40 rounded-[24px] pointer-events-none"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <h3 className="font-playfair italic text-[22px] text-bloom-dark mb-6 relative z-10">{capsule.title}</h3>

      <div className="relative mb-6 z-10">
        {/* Wax Seal SVG */}
        <motion.div
          animate={!isReady ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 relative"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M50 5C25 5 5 25 5 50C5 75 25 95 50 95C75 95 95 75 95 50C95 25 75 5 50 5Z" fill="#A83246" />
            <path d="M50 15C30 15 15 30 15 50C15 70 30 85 50 85C70 85 85 70 85 50C85 30 70 15 50 15Z" fill="#8B2132" />
            <path d="M40 30L60 70M30 40L70 60M30 60L70 40M40 70L60 30" stroke="#701524" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="12" fill="#A83246" />
            {isLocked && <Lock size={12} color="#FFF" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80" />}
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10">
        {isReady ? (
          <span className="font-caveat text-[20px] text-bloom-blue font-bold tracking-wider">Ready to open!</span>
        ) : (
          <span className="font-lato font-light text-[13px] text-bloom-soft">{remainingText}</span>
        )}
      </div>
    </motion.div>
  );
}
