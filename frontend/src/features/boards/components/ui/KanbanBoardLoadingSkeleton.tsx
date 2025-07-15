"use client";

import { motion, AnimatePresence } from "framer-motion";

export function KanbanBoardLoadingSkeleton() {
  return (
    <AnimatePresence>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-80 h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse flex-shrink-0 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
    </AnimatePresence>
  );
}
