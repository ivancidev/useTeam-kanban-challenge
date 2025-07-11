import { create } from "zustand";
import { DragState } from "../types";

interface DragStore extends DragState {
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
  setCalculatedOrder: (order: number) => void;
  // Column drag methods
  setColumnDragState: (state: {
    isDraggingColumn: boolean;
    activeColumnId?: string | null;
    targetColumnIndex?: number | null;
  }) => void;
  resetColumnDragState: () => void;
}

const initialState: DragState = {
  isDragging: false,
  activeCardId: null,
  targetColumnId: null,
  insertPosition: null,
  calculatedOrder: null,
  isDraggingColumn: false,
  activeColumnId: null,
  targetColumnIndex: null,
};

export const useDragStore = create<DragStore>((set) => ({
  ...initialState,

  setDragState: (newState) => set((state) => ({ ...state, ...newState })),

  resetDragState: () => set(initialState),

  setCalculatedOrder: (order) =>
    set((state) => ({ ...state, calculatedOrder: order })),

  setColumnDragState: (columnState) =>
    set((state) => ({
      ...state,
      isDraggingColumn: columnState.isDraggingColumn,
      activeColumnId: columnState.activeColumnId ?? state.activeColumnId,
      targetColumnIndex:
        columnState.targetColumnIndex ?? state.targetColumnIndex,
    })),

  resetColumnDragState: () =>
    set((state) => ({
      ...state,
      isDraggingColumn: false,
      activeColumnId: null,
      targetColumnIndex: null,
    })),
}));
