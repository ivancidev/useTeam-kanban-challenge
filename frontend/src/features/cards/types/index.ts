export interface Card {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  order?: number;
  columnId: string;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  order?: number;
}

export interface MoveCardDto {
  columnId: string;
  order: number;
}

export interface CardFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCardDto) => void;
  onEdit?: (data: UpdateCardDto) => void;
  card?: Card;
  columnId: string;
  isLoading?: boolean;
}

export interface CardItemProps {
  card: Card;
  onClick?: (card: Card) => void;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  isLoading?: boolean;
}


export interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  onSave: (data: UpdateCardDto) => Promise<void>;
  onDelete: () => void;
  columnName: string;
}