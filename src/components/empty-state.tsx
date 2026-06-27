import { motion } from "framer-motion";

const ICONS = [
  /* bunny */
  <svg key="b" width="72" height="72" viewBox="0 0 100 100" fill="none">
    <ellipse cx="35" cy="30" rx="8" ry="20" fill="#F2C4CE" opacity="0.85"/>
    <ellipse cx="35" cy="30" rx="5" ry="14" fill="#FAE8EE" opacity="0.9"/>
    <ellipse cx="65" cy="28" rx="8" ry="20" fill="#F2C4CE" opacity="0.85"/>
    <ellipse cx="65" cy="28" rx="5" ry="14" fill="#FAE8EE" opacity="0.9"/>
    <ellipse cx="50" cy="63" rx="22" ry="20" fill="#FAE8EE" opacity="0.95"/>
    <circle cx="43" cy="61" r="3.5" fill="#C9B8E8" opacity="0.75"/>
    <circle cx="57" cy="61" r="3.5" fill="#C9B8E8" opacity="0.75"/>
    <ellipse cx="50" cy="68" rx="5" ry="3" fill="#E8A0B0" opacity="0.8"/>
    <ellipse cx="50" cy="53" rx="7" ry="4.5" fill="#FFF8F0"/>
  </svg>,
  /* bird on branch */
  <svg key="bird" width="72" height="72" viewBox="0 0 100 100" fill="none">
    <path d="M10 72 Q50 58 90 68" stroke="#A8C8A0" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <ellipse cx="58" cy="46" rx="15" ry="11" fill="#C9B8E8" opacity="0.85"/>
    <ellipse cx="73" cy="43" rx="7" ry="6" fill="#C9B8E8" opacity="0.85"/>
    <path d="M33 42 Q40 33 54 42" stroke="#C9B8E8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M33 42 Q42 51 54 46" stroke="#C9B8E8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8"/>
    <circle cx="77" cy="41" r="2.5" fill="#FFF8F0"/>
    <path d="M80 48 L86 51" stroke="#C9B8E8" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    <path d="M57 57 L55 65" stroke="#C9B8E8" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
    <path d="M55 65 L51 65" stroke="#C9B8E8" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
    <path d="M55 65 L58 68" stroke="#C9B8E8" strokeWidth="2" strokeLinecap="round" opacity="0.55"/>
  </svg>,
  /* open book with flower */
  <svg key="book" width="72" height="72" viewBox="0 0 100 100" fill="none">
    <rect x="10" y="28" width="38" height="46" rx="4" fill="#EDE6F8" opacity="0.7"/>
    <rect x="52" y="28" width="38" height="46" rx="4" fill="#EDE6F8" opacity="0.7"/>
    <line x1="50" y1="28" x2="50" y2="74" stroke="#C9B8E8" strokeWidth="2"/>
    <line x1="18" y1="42" x2="42" y2="42" stroke="#C9B8E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <line x1="18" y1="51" x2="42" y2="51" stroke="#C9B8E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
    <ellipse cx="71" cy="58" rx="5" ry="9" fill="#F2C4CE" opacity="0.8"/>
    <ellipse cx="71" cy="58" rx="5" ry="9" fill="#F2C4CE" opacity="0.8" transform="rotate(60 71 58)"/>
    <ellipse cx="71" cy="58" rx="5" ry="9" fill="#FAE8EE" opacity="0.6" transform="rotate(120 71 58)"/>
    <circle cx="71" cy="58" r="4" fill="#F5E6A3"/>
    <path d="M71 67 L68 74" stroke="#A8C8A0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>,
];

const seededIdx = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % ICONS.length;
};

export function EmptyState({ message }: { message: string }) {
  const idx = seededIdx(message);
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      {/* Washi tape top */}
      <div className="w-14 h-4 rounded-sm mb-[-8px] relative z-10"
        style={{ background: "linear-gradient(90deg,#F2C4CE,#FAE8EE)", opacity: 0.65, transform: "rotate(-2deg)" }} />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="diary-card rounded-[20px] px-8 py-8 w-full max-w-[260px]"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-5"
        >
          {ICONS[idx]}
        </motion.div>

        <p className="font-caveat text-[22px] text-bloom-soft leading-snug">
          {message}
        </p>

        <div className="mt-5 space-y-2">
          {[100, 70, 40].map((op, i) => (
            <div key={i} className="h-px rounded-full" style={{ background: "#F2C4CE", opacity: op / 100 }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
