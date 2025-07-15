"use client";

import { CardDetailView } from "./CardDetailView";
import { Card, UpdateCardDto } from "../types";

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
    <div className="w-full max-w-[98vw] mx-auto">
      <CardDetailView
        isOpen={isOpen}
        onClose={onClose}
        card={card}
        onUpdate={onUpdate}
        columnName={columnName}
      />
    </div>
  );
}
