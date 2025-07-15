"use client";

import { motion, AnimatePresence } from "framer-motion";

const COLUMN_COUNT = 4;
const CARDS_PER_COLUMN = 6;

export function KanbanBoardLoadingSkeleton() {
  return (
    <AnimatePresence>
      <div className="flex flex-wrap gap-6 justify-center sm:justify-start px-4">
        {[...Array(COLUMN_COUNT)].map((_, colIdx) => (
          <motion.div
            key={colIdx}
            className="flex-shrink-0 w-full max-w-xs sm:w-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg p-4 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: colIdx * 0.15 }}
          >
            <div className="h-8 bg-gray-300 rounded-md mb-4 animate-pulse" />

            <div className="flex flex-col gap-3 flex-grow overflow-hidden">
              {[...Array(CARDS_PER_COLUMN)].map((_, cardIdx) => (
                <div
                  key={cardIdx}
                  className="h-14 bg-gray-300 rounded-md animate-pulse"
                  style={{
                    animationDelay: `${
                      (colIdx * CARDS_PER_COLUMN + cardIdx) * 0.1
                    }s`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
