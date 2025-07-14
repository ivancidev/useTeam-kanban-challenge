"use client";

import { Card, UpdateCardDto } from "../types";
import { CardDetailViewInline } from "./CardDetailViewInline";

interface CardViewEditContainerProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
  columnName?: string;
}

export function CardViewEditContainer({
  card,
  isOpen,
  onClose,
  onUpdate,
  columnName,
}: CardViewEditContainerProps) {
  return (
    <CardDetailViewInline
      isOpen={isOpen}
      onClose={onClose}
      card={card}
      onUpdate={onUpdate}
      columnName={columnName}
    />
  );
}
