import type { Column } from "../../features/columns/types";
import { DropCalculation } from "../types";

/**
 * Calcula la posición de inserción cuando se suelta una tarjeta en el tablero Kanban
 * Determina en qué columna y en qué posición insertar la tarjeta arrastrada
 * @param overId - ID del elemento sobre el cual se está soltando
 * @param columns - Array de todas las columnas del tablero
 * @param activeCardId - ID de la tarjeta que se está arrastrando (opcional)
 * @returns Objeto con columna destino, índice de inserción y nuevo orden
 */
export function calculateDropPosition(
  overId: string,
  columns: Column[],
  activeCardId?: string
): DropCalculation {
  let targetColumn: Column | null = null;
  let insertAtIndex = -1;

  // Primero verificar si se está soltando sobre una tarjeta
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

  // Si no se suelta sobre una tarjeta, verificar si es sobre una columna o área de tarjetas
  if (!targetColumn) {
    // Verificar primero el área de tarjetas (formato de ID: "columnId-cards")
    if (overId.endsWith("-cards")) {
      const columnId = overId.replace("-cards", "");
      targetColumn = columns.find((col) => col.id === columnId) || null;
      if (targetColumn) {
        // Soltando en área de tarjetas - agregar al final
        insertAtIndex = targetColumn.cards?.length || 0;
      }
    } else {
      // Verificar si es un soltar directo en columna
      targetColumn = columns.find((col) => col.id === overId) || null;
      if (targetColumn) {
        // Soltando en columna - agregar al final
        insertAtIndex = targetColumn.cards?.length || 0;
      }
    }
  }

  if (!targetColumn) {
    return {
      targetColumn: null,
      insertAtIndex: -1,
      newOrder: 0,
    };
  }

  // Calcular nuevo orden basado en la posición
  let newOrder: number;
  const allCards = targetColumn.cards || [];

  // Para el cálculo del order, excluimos la tarjeta arrastrada
  const targetCards = allCards.filter((card) => card.id !== activeCardId);

  // Si la tarjeta arrastrada está en la misma columna, ajustamos el insertAtIndex
  const draggedCardCurrentIndex = allCards.findIndex(
    (card) => card.id === activeCardId
  );
  const isMovingWithinSameColumn = draggedCardCurrentIndex >= 0;

  const visualInsertIndex = insertAtIndex; // Este es para el indicador visual
  let calculationIndex = insertAtIndex; // Este es para el cálculo del order

  if (isMovingWithinSameColumn) {
    // Si movemos hacia adelante en la misma columna
    if (insertAtIndex > draggedCardCurrentIndex) {
      calculationIndex = insertAtIndex - 1;
    }
  }

  if (calculationIndex <= 0 || targetCards.length === 0) {
    // Insertar al principio o en columna vacía
    newOrder = targetCards.length > 0 ? targetCards[0].order - 1 : 1;
  } else if (calculationIndex >= targetCards.length) {
    // Insertar al final
    newOrder =
      targetCards.length > 0
        ? Math.max(...targetCards.map((c) => c.order)) + 1
        : 1;
  } else {
    // Insertar entre tarjetas
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
