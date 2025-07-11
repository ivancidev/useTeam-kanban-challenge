import type { Column } from "../../features/columns/types";
import { DropCalculation } from "../types";

export function calculateDropPosition(
  overId: string,
  columns: Column[],
  activeCardId?: string
): DropCalculation {
  let targetColumn: Column | null = null;
  let insertAtIndex = -1;

  // First check if dropping on a card
  for (const column of columns) {
    if (column.cards) {
      const cardIndex = column.cards.findIndex((card) => card.id === overId);
      if (cardIndex >= 0) {
        targetColumn = column;
        // Cuando se arrastra sobre una tarjeta, insertar ANTES de esa tarjeta
        insertAtIndex = cardIndex;
        break;
      }
    }
  }

  // If not dropping on a card, check if dropping on a column
  if (!targetColumn) {
    targetColumn = columns.find((col) => col.id === overId) || null;
    if (targetColumn) {
      // Dropping on column - add to end
      insertAtIndex = targetColumn.cards?.length || 0;
    }
  }

  if (!targetColumn) {
    return {
      targetColumn: null,
      insertAtIndex: -1,
      newOrder: 0,
    };
  }

  // Calculate new order based on position
  let newOrder: number;
  const allCards = targetColumn.cards || [];
  
  // Para el cálculo del order, excluimos la tarjeta arrastrada
  const targetCards = allCards.filter(card => card.id !== activeCardId);
  
  // Si la tarjeta arrastrada está en la misma columna, ajustamos el insertAtIndex
  const draggedCardCurrentIndex = allCards.findIndex(card => card.id === activeCardId);
  const isMovingWithinSameColumn = draggedCardCurrentIndex >= 0;
  
  const visualInsertIndex = insertAtIndex; // Este es para el indicador visual
  let calculationIndex = insertAtIndex;    // Este es para el cálculo del order
  
  if (isMovingWithinSameColumn) {
    // Si movemos hacia adelante en la misma columna
    if (insertAtIndex > draggedCardCurrentIndex) {
      calculationIndex = insertAtIndex - 1;
    }
  }

  if (calculationIndex <= 0 || targetCards.length === 0) {
    // Insert at beginning or in empty column
    newOrder = targetCards.length > 0 ? targetCards[0].order - 1 : 1;
  } else if (calculationIndex >= targetCards.length) {
    // Insert at end
    newOrder =
      targetCards.length > 0
        ? Math.max(...targetCards.map((c) => c.order)) + 1
        : 1;
  } else {
    // Insert between cards
    const prevCard = targetCards[calculationIndex - 1];
    const nextCard = targetCards[calculationIndex];
    newOrder = (prevCard.order + nextCard.order) / 2;
  }

  return {
    targetColumn,
    insertAtIndex: visualInsertIndex, // Usar el índice visual para los indicadores
    newOrder,
  };
}
