export enum CardPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum CardType {
  TASK = "TASK",
  BUG = "BUG",
  ENHANCEMENT = "ENHANCEMENT",
  FEATURE = "FEATURE",
  DOCUMENTATION = "DOCUMENTATION",
  RESEARCH = "RESEARCH",
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  comments?: string;
  dueDate?: string;
  priority: CardPriority;
  type: CardType;
  tags: string[];
  order: number;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  comments?: string;
  dueDate?: string;
  priority?: CardPriority;
  type?: CardType;
  tags?: string[];
  order?: number;
  columnId: string;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  comments?: string;
  dueDate?: string;
  priority?: CardPriority;
  type?: CardType;
  tags?: string[];
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

export interface CardDisplayProps {
  card: Card;
  className?: string;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

export interface UseCardFormDialogProps {
  card?: Card;
  columnId: string;
  onSubmit: (data: CreateCardDto) => void;
  onEdit?: (data: UpdateCardDto) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export interface FormErrors {
  title?: string;
}
