import type { Column } from "../../features/columns/types";
import { ReactNode } from "react";


export interface DropCalculation {
  targetColumn: Column | null;
  insertAtIndex: number;
  newOrder: number;
}


export interface DragState {
  isDragging: boolean;
  activeCardId: string | null;
  targetColumnId: string | null;
  insertPosition: number | null;
  calculatedOrder: number | null;
  isDraggingColumn: boolean;
  activeColumnId: string | null;
  targetColumnIndex: number | null;
}


export interface DraggableColumnWrapperProps {
  columnId: string;
  index: number;
  isDragging: boolean;
  isTarget: boolean;
  onDragStart: (columnId: string) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  children: ReactNode;
}