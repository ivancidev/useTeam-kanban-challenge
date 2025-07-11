import type { Card } from "../../cards/types";

export interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
  cards?: Card[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateColumnDto {
  name: string;
  order?: number;
  boardId?: string;
}

export interface UpdateColumnDto {
  name?: string;
  order?: number;
}

export interface ColumnCardProps {
  column: Column;
  onEdit: (column: Column) => void;
  onDelete: (columnId: string) => void;
  onColumnUpdate?: (updatedColumn: Column) => void;
  isLoading?: boolean;
  shouldShowDropIndicator?: (columnId: string, position: number) => boolean;
  dragState?: {
    isDragging: boolean;
    activeCardId: string | null;
    targetColumnId: string | null;
    insertPosition: number | null;
  };
}

export interface ColumnFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateColumnDto) => Promise<void>;
  onEdit?: (data: UpdateColumnDto) => Promise<void>;
  column?: Column;
  isLoading?: boolean;
}

// Re-export Card type for Column relations
export type { Card } from "../../cards/types";
