import type { Column } from "../../features/columns/types";

export interface DropCalculation {
  targetColumn: Column | null;
  insertAtIndex: number;
  newOrder: number;
}

export function calculateDropPosition(
  overId: string,
  columns: Column[],
  activeCardId?: string
): DropCalculation {
  let targetColumn: Column | null = null;
  let insertAtIndex = -1;

  // Buscar si se está soltando sobre una tarjeta
  for (const column of columns) {
    if (column.cards && column.cards.length > 0) {
      const sortedCards = [...column.cards].sort((a, b) => a.order - b.order);
      const cardIndex = sortedCards.findIndex((card) => card.id === overId);
      if (cardIndex >= 0) {
        targetColumn = column;
        insertAtIndex = cardIndex;
        break;
      }
    }
  }

  // Si no es sobre una tarjeta, verificar si es sobre una columna
  if (!targetColumn) {
    targetColumn = columns.find((col) => col.id === overId) || null;
    if (targetColumn) {
      const sortedCards = targetColumn.cards
        ? [...targetColumn.cards].sort((a, b) => a.order - b.order)
        : [];
      insertAtIndex = sortedCards.length;
    }
  }

  if (!targetColumn) {
    return {
      targetColumn: null,
      insertAtIndex: -1,
      newOrder: 0,
    };
  }

  // Calcular el newOrder
  const allCards = [...(targetColumn.cards || [])].sort(
    (a, b) => a.order - b.order
  );
  const cardsWithoutDragged = allCards.filter(
    (card) => card.id !== activeCardId
  );

  let newOrder: number;

  if (cardsWithoutDragged.length === 0) {
    newOrder = 1000;
  } else if (insertAtIndex === 0) {
    newOrder = cardsWithoutDragged[0].order - 1000;
  } else if (insertAtIndex >= allCards.length) {
    newOrder = cardsWithoutDragged[cardsWithoutDragged.length - 1].order + 1000;
  } else {
    let effectiveIndex = insertAtIndex;

    const draggedOriginalIndex = allCards.findIndex(
      (card) => card.id === activeCardId
    );
    if (draggedOriginalIndex >= 0 && draggedOriginalIndex < insertAtIndex) {
      effectiveIndex = insertAtIndex - 1;
    }

    effectiveIndex = Math.max(
      0,
      Math.min(effectiveIndex, cardsWithoutDragged.length)
    );

    if (effectiveIndex === 0) {
      newOrder = cardsWithoutDragged[0].order - 1000;
    } else if (effectiveIndex >= cardsWithoutDragged.length) {
      newOrder =
        cardsWithoutDragged[cardsWithoutDragged.length - 1].order + 1000;
    } else {
      const prevCard = cardsWithoutDragged[effectiveIndex - 1];
      const nextCard = cardsWithoutDragged[effectiveIndex];
      newOrder = Math.floor((prevCard.order + nextCard.order) / 2);

      if (Math.abs(nextCard.order - prevCard.order) < 10) {
        newOrder = prevCard.order + 500;
      }
    }
  }

  return {
    targetColumn,
    insertAtIndex,
    newOrder,
  };
}
