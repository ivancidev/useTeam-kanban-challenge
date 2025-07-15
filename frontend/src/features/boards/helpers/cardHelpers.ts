import type { Column } from "../types";
import type { Card } from "../../cards/types";

/**
 * Encuentra una tarjeta específica en las columnas
 */
export const findCardInColumns = (
  columns: Column[],
  cardId: string
): {
  card: Card | null;
  columnId: string | null;
  order: number | null;
} => {
  for (const column of columns) {
    const card = column.cards?.find((c) => c.id === cardId);
    if (card) {
      return {
        card,
        columnId: column.id,
        order: card.order,
      };
    }
  }

  return {
    card: null,
    columnId: null,
    order: null,
  };
};

/**
 * Actualiza las columnas moviendo una tarjeta a su nueva posición
 */
export const updateColumnsWithCard = (
  columns: Column[],
  cardId: string,
  targetColumnId: string,
  optimisticCard: Card
): Column[] => {
  return columns.map((column) => {
    if (column.id === targetColumnId) {
      // Agregar o actualizar tarjeta en la columna objetivo
      const cardExists = column.cards?.some((card) => card.id === cardId);
      if (!cardExists) {
        return {
          ...column,
          cards: [...(column.cards || []), optimisticCard].sort(
            (a, b) => a.order - b.order
          ),
        };
      } else {
        return {
          ...column,
          cards: (column.cards || [])
            .map((card) => (card.id === cardId ? optimisticCard : card))
            .sort((a, b) => a.order - b.order),
        };
      }
    } else {
      // Remover tarjeta de otras columnas
      return {
        ...column,
        cards: (column.cards || []).filter((card) => card.id !== cardId),
      };
    }
  });
};

/**
 * Revierte el movimiento de una tarjeta (rollback)
 */
export const rollbackCardMove = (
  columns: Column[],
  cardId: string,
  currentColumnId: string | null,
  targetColumnId: string,
  originalCard: Card
): Column[] => {
  return columns.map((column) => {
    if (column.id === currentColumnId) {
      const cardExists = column.cards?.some((card) => card.id === cardId);
      if (!cardExists) {
        return {
          ...column,
          cards: [...(column.cards || []), originalCard].sort(
            (a, b) => a.order - b.order
          ),
        };
      } else {
        return {
          ...column,
          cards: (column.cards || [])
            .map((card) => (card.id === cardId ? originalCard : card))
            .sort((a, b) => a.order - b.order),
        };
      }
    } else if (column.id === targetColumnId) {
      // Remover tarjeta de la columna objetivo donde fue colocada optimísticamente
      return {
        ...column,
        cards: (column.cards || []).filter((card) => card.id !== cardId),
      };
    }
    return column;
  });
};

/**
 * Verifica si un movimiento de tarjeta es realmente necesario
 */
export const isCardMovementRequired = (
  currentColumnId: string | null,
  targetColumnId: string,
  currentOrder: number | null,
  newOrder: number
): boolean => {
  const isSameColumn = currentColumnId === targetColumnId;
  const isSameOrder = Math.abs((currentOrder || 0) - newOrder) < 0.001;

  return !(isSameColumn && isSameOrder);
};
