import { create } from "zustand";

interface DragState {
  isDragging: boolean;
  activeCardId: string | null;
  targetColumnId: string | null;
  insertPosition: number | null;
  calculatedOrder: number | null;
}

interface DragStore extends DragState {
  setDragState: (state: Partial<DragState>) => void;
  resetDragState: () => void;
  setCalculatedOrder: (order: number) => void;
}

const initialState: DragState = {
  isDragging: false,
  activeCardId: null,
  targetColumnId: null,
  insertPosition: null,
  calculatedOrder: null,
};

export const useDragStore = create<DragStore>((set) => ({
  ...initialState,

  setDragState: (newState) => set((state) => ({ ...state, ...newState })),

  resetDragState: () => set(initialState),

  setCalculatedOrder: (order) =>
    set((state) => ({ ...state, calculatedOrder: order })),
}));
