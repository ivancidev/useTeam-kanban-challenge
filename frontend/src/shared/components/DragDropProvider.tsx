"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import type { Card } from "../../features/cards/types";
import type { Column } from "../../features/columns/types";

interface DragDropProviderProps {
  children: React.ReactNode;
  columns: Column[];
  onMoveCard: (
    cardId: string,
    targetColumnId: string,
    newOrder: number
  ) => void;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export function DragDropProvider({
  children,
  columns,
  onMoveCard,
}: DragDropProviderProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Find the card being dragged
    for (const column of columns) {
      const card = column.cards?.find((c: Card) => c.id === active.id);
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    // Find the source column and card
    let sourceColumn;
    let sourceCard;
    for (const column of columns) {
      const card = column.cards?.find((c: Card) => c.id === activeCardId);
      if (card) {
        sourceColumn = column;
        sourceCard = card;
        break;
      }
    }

    if (!sourceColumn || !sourceCard) return;

    // Check if dropping on a column or a card
    let targetColumn;
    let insertAtIndex = -1;

    // First check if dropping on a card
    for (const column of columns) {
      const cardIndex = column.cards?.findIndex((c: Card) => c.id === overId);
      if (cardIndex !== undefined && cardIndex >= 0) {
        targetColumn = column;
        insertAtIndex = cardIndex;
        break;
      }
    }

    // If not dropping on a card, check if dropping on a column
    if (!targetColumn) {
      targetColumn = columns.find((col) => col.id === overId);
      if (targetColumn) {
        // Dropping on column - add to end
        insertAtIndex = targetColumn.cards?.length || 0;
      }
    }

    if (!targetColumn) return;

    // Calculate new order based on position
    let newOrder: number;
    const targetCards = targetColumn.cards || [];

    if (insertAtIndex === 0) {
      // Insert at beginning
      newOrder = targetCards.length > 0 ? targetCards[0].order - 1 : 0;
    } else if (insertAtIndex >= targetCards.length) {
      // Insert at end
      newOrder =
        targetCards.length > 0
          ? Math.max(...targetCards.map((c) => c.order)) + 1
          : 0;
    } else {
      // Insert between cards
      const prevCard = targetCards[insertAtIndex - 1];
      const nextCard = targetCards[insertAtIndex];
      newOrder = (prevCard.order + nextCard.order) / 2;
    }

    // Only move if there's actually a change
    if (
      sourceColumn.id !== targetColumn.id ||
      Math.abs(sourceCard.order - newOrder) > 0.1
    ) {
      onMoveCard(activeCardId, targetColumn.id, newOrder);
    }
  };

  const handleDragOver = () => {
    // Handle drag over logic if needed
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border opacity-90">
            <h3 className="font-medium text-gray-900">{activeCard.title}</h3>
            {activeCard.description && (
              <p className="text-sm text-gray-600 mt-2">
                {activeCard.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
