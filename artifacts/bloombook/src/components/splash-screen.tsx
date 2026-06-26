import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("bloombook_visited");
    if (!visited) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("bloombook_visited", "1");
  };

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bloom-cream px-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M50 50 C 50 20, 20 20, 50 50 Z"
                stroke="var(--bloom-pink-deep)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                fill="var(--bloom-pink-light)"
              />
              <motion.path
                d="M50 50 C 80 20, 80 50, 50 50 Z"
                stroke="var(--bloom-pink-deep)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                fill="var(--bloom-pink-light)"
              />
              <motion.path
                d="M50 50 C 80 80, 50 80, 50 50 Z"
                stroke="var(--bloom-pink-deep)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                fill="var(--bloom-pink-light)"
              />
              <motion.path
                d="M50 50 C 20 80, 20 50, 50 50 Z"
                stroke="var(--bloom-pink-deep)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
                fill="var(--bloom-pink-light)"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="8"
                fill="var(--bloom-butter)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="font-playfair text-[52px] italic text-bloom-dark mb-2"
          >
            BloomBook
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="font-lato font-light text-bloom-soft text-lg"
          >
            Where little moments bloom forever.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
            onClick={handleClose}
            className="mt-12 w-full max-w-[240px] rounded-full bg-gradient-to-r from-[#F2C4CE] to-[#E8A0B0] py-4 text-white font-lato font-bold text-lg shadow-[0_4px_16px_rgba(232,160,176,0.4)] active:scale-95 transition-transform"
            data-testid="button-open-bloombook"
          >
            Open my BloomBook
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
