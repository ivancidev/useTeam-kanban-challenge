"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { containerAnimations } from "@/shared/helpers/animationHelpers";
import { KanbanScrollNavigationButton } from "./KanbanScrollNavigationButton";

interface KanbanColumnsContainerProps {
  children: ReactNode;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  onScroll: (element: HTMLDivElement) => void;
}

export function KanbanColumnsContainer({
  children,
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  onScroll,
}: KanbanColumnsContainerProps) {
  return (
    <div className="relative pb-2">
      {/* Botones de navegación scroll */}
      <KanbanScrollNavigationButton
        direction="left"
        onClick={onScrollLeft}
        visible={canScrollLeft}
      />

      <KanbanScrollNavigationButton
        direction="right"
        onClick={onScrollRight}
        visible={canScrollRight}
      />

      <div
        className="kanban-horizontal-scroll overflow-x-auto overflow-y-hidden pb-8 scroll-smooth"
        style={{ height: "calc(100vh - 10px)" }}
        onScroll={(e) => onScroll(e.currentTarget)}
      >
        <motion.div className="flex gap-6" variants={containerAnimations}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
