import type { Card, Column } from "../../features/columns/types";


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

export interface UseRealtimeSyncProps {
  boardId: string;
  onColumnCreated: (column: Column) => void;
  onColumnUpdated: (column: Column) => void;
  onColumnDeleted: (columnId: string) => void;
  onCardCreated: (card: Card) => void;
  onCardUpdated: (card: Card) => void;
  onCardMoved: (cardData: {
    cardId: string;
    targetColumnId: string;
    newOrder: number;
  }) => void;
  onCardDeleted: (cardId: string) => void;
  onBoardUpdated?: (data: { columns: Column[]; cards: Card[] }) => void;
}
