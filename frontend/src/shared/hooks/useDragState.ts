"use client";

import { useState } from "react";

interface DragState {
  isDragging: boolean;
  activeCardId: string | null;
  targetColumnId: string | null;
  insertPosition: number | null;
}

export function useDragState() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    activeCardId: null,
    targetColumnId: null,
    insertPosition: null,
  });

  const updateDragState = (newState: DragState) => {
    setDragState(newState);
  };

  const isCardBeingDragged = (cardId: string) => {
    return dragState.isDragging && dragState.activeCardId === cardId;
  };

  const shouldShowDropIndicator = (columnId: string, position: number) => {
    return (
      dragState.isDragging &&
      dragState.targetColumnId === columnId &&
      dragState.insertPosition === position
    );
  };

  return {
    dragState,
    updateDragState,
    isCardBeingDragged,
    shouldShowDropIndicator,
  };
}
