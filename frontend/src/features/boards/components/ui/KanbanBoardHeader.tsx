"use client";

import { motion } from "framer-motion";
import { actionIcons, uiIcons } from "@/shared/helpers/iconHelpers";
import { buttonAnimations } from "@/shared/helpers/animationHelpers";
import { getButtonClasses } from "@/shared/helpers/colorHelpers";

interface KanbanBoardHeaderProps {
  onCreateColumn: () => void;
  isLoading: boolean;
}

export function KanbanBoardHeader({
  onCreateColumn,
  isLoading,
}: KanbanBoardHeaderProps) {
  return (
    <motion.div
      className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm w-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Icono mejorado con animación */}
          <motion.div
            className="p-2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-md shadow-sm"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <uiIcons.kanban className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              Tablero Kanban
            </h1>
            <p className="text-slate-600 text-xs font-medium">
              Gestiona tus tareas de forma visual y colaborativa
            </p>
          </div>
        </div>
      </div>

      <motion.button
        onClick={onCreateColumn}
        disabled={isLoading}
        className={`${getButtonClasses(
          "primary"
        )} flex items-center gap-2 shadow-md px-3 py-2 text-sm font-semibold rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-200`}
        variants={buttonAnimations}
        whileHover="hover"
        whileTap="tap"
      >
        <actionIcons.add className="h-4 w-4" />
        <span>Nueva Columna</span>
      </motion.button>
    </motion.div>
  );
}
