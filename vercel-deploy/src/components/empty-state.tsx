import { motion } from "framer-motion";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 50 C 50 30, 30 30, 50 50 Z" fill="var(--bloom-pink)" />
          <path d="M50 50 C 70 30, 70 50, 50 50 Z" fill="var(--bloom-pink)" />
          <path d="M50 50 C 70 70, 50 70, 50 50 Z" fill="var(--bloom-pink)" />
          <path d="M50 50 C 30 70, 30 50, 50 50 Z" fill="var(--bloom-pink)" />
          <circle cx="50" cy="50" r="10" fill="var(--bloom-butter)" />
        </svg>
      </motion.div>
      <p className="font-caveat text-[22px] text-bloom-soft leading-relaxed max-w-[240px]">
        {message}
      </p>
    </div>
  );
}
