import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "for every flower pressed & every page turned",
  "for the girl who loves every creature she meets",
  "your little garden of memories",
];

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER_ANGLES = [22, 67, 112, 157, 202, 247];
const CENTER_DOTS: [number, number][] = [[80, 74], [75, 82], [85, 82], [80, 87]];

const BG_PETALS = [
  { x: "8%", y: "12%", r: 18, c: "#F2C4CE", rot: -20, delay: 0.2 },
  { x: "85%", y: "8%", r: 14, c: "#C9B8E8", rot: 40, delay: 0.3 },
  { x: "5%", y: "72%", r: 10, c: "#A8C8E8", rot: 15, delay: 0.5 },
  { x: "88%", y: "68%", r: 16, c: "#F5C6A0", rot: -30, delay: 0.4 },
  { x: "15%", y: "88%", r: 12, c: "#F2C4CE", rot: 55, delay: 0.6 },
  { x: "78%", y: "85%", r: 10, c: "#A8C8A0", rot: -10, delay: 0.35 },
];

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));

  useEffect(() => {
    const visited = localStorage.getItem("bloombook_visited");
    if (!visited) setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("bloombook_visited", "1");
  };

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(handleClose, 6000);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bloom-cream px-6 overflow-hidden"
        >
          {/* Scattered background petals */}
          {BG_PETALS.map((p, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{ left: p.x, top: p.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.55, scale: 1, rotate: p.rot }}
              transition={{ delay: p.delay, duration: 1.2, ease: "easeOut" }}
            >
              <svg width={p.r * 2} height={p.r * 2} viewBox="0 0 36 36" fill="none">
                <ellipse cx="18" cy="18" rx="5" ry="9" fill={p.c} opacity="0.6" />
                <ellipse cx="18" cy="18" rx="5" ry="9" fill={p.c} opacity="0.6" transform="rotate(60 18 18)" />
                <ellipse cx="18" cy="18" rx="5" ry="9" fill={p.c} opacity="0.45" transform="rotate(120 18 18)" />
                <circle cx="18" cy="18" r="4" fill="#F5E6A3" opacity="0.9" />
              </svg>
            </motion.div>
          ))}

          {/* Main flower */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative mb-2"
          >
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              {PETAL_ANGLES.map((angle, i) => (
                <motion.ellipse
                  key={i}
                  cx="80" cy="80" rx="14" ry="34"
                  fill={i % 2 === 0 ? "#F2C4CE" : "#FAE8EE"}
                  opacity={i % 2 === 0 ? 0.85 : 0.65}
                  transform={`rotate(${angle} 80 80)`}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: i % 2 === 0 ? 0.85 : 0.65 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                  style={{ transformOrigin: "80px 80px" }}
                />
              ))}
              {INNER_ANGLES.map((angle, i) => (
                <motion.ellipse
                  key={`inner-${i}`}
                  cx="80" cy="80" rx="8" ry="22"
                  fill="#E8A0B0" opacity="0.5"
                  transform={`rotate(${angle} 80 80)`}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 0.5 }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                  style={{ transformOrigin: "80px 80px" }}
                />
              ))}
              <motion.circle cx="80" cy="80" r="16" fill="#F5E6A3"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5, type: "spring", stiffness: 300 }}
                style={{ transformOrigin: "80px 80px" }}
              />
              <motion.circle cx="80" cy="80" r="10" fill="#F5C6A0"
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 1.6, duration: 0.4 }}
                style={{ transformOrigin: "80px 80px" }}
              />
              {CENTER_DOTS.map(([cx, cy], i) => (
                <motion.circle key={`dot-${i}`} cx={cx} cy={cy} r="1.8" fill="#E8A0B0" opacity="0.7"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                  transition={{ delay: 1.9 + i * 0.05 }}
                />
              ))}
            </svg>

            {/* Tiny bird */}
            <motion.div className="absolute -top-3 -right-4"
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              <svg width="40" height="28" viewBox="0 0 60 40" fill="none">
                <ellipse cx="32" cy="22" rx="12" ry="8" fill="#C9B8E8" opacity="0.85" />
                <ellipse cx="44" cy="20" rx="5" ry="4" fill="#C9B8E8" opacity="0.85" />
                <path d="M16 18 Q20 12 28 18" stroke="#C9B8E8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
                <path d="M16 18 Q22 24 28 20" stroke="#C9B8E8" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
                <circle cx="47" cy="18" r="1.5" fill="#FFF8F0" />
                <path d="M49 22 L53 24" stroke="#C9B8E8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              </svg>
            </motion.div>

            {/* Tiny paw print */}
            <motion.div className="absolute -bottom-1 -left-5"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1 }}
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <ellipse cx="20" cy="26" rx="9" ry="7" fill="#E8A0B0" />
                <ellipse cx="11" cy="17" rx="4" ry="5" fill="#E8A0B0" />
                <ellipse cx="20" cy="14" rx="4" ry="5" fill="#E8A0B0" />
                <ellipse cx="29" cy="17" rx="4" ry="5" fill="#E8A0B0" />
              </svg>
            </motion.div>

            {/* Tiny open book */}
            <motion.div className="absolute -bottom-2 -right-6"
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1 }}
              transition={{ delay: 2.6, duration: 0.5 }}
            >
              <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
                <rect x="8" y="10" width="26" height="26" rx="3" fill="#8A6BC0" opacity="0.3" />
                <rect x="10" y="10" width="22" height="26" rx="2" fill="#8A6BC0" opacity="0.5" />
                <line x1="10" y1="10" x2="10" y2="36" stroke="#8A6BC0" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                <line x1="15" y1="18" x2="28" y2="18" stroke="#8A6BC0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <line x1="15" y1="23" x2="28" y2="23" stroke="#8A6BC0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <line x1="15" y1="28" x2="22" y2="28" stroke="#8A6BC0" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="font-playfair italic text-[52px] text-bloom-dark tracking-[-0.02em] mt-6"
          >
            BloomBook
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="font-caveat text-bloom-soft text-xl text-center mt-2 max-w-[260px] leading-snug"
          >
            {quotes[quoteIdx]}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
            onClick={handleClose}
            className="mt-10 w-full max-w-[240px] rounded-full bg-gradient-to-r from-[#F2C4CE] to-[#E8A0B0] py-4 text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(232,160,176,0.4)] active:scale-95 transition-transform"
            data-testid="button-open-bloombook"
          >
            Open my BloomBook
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
