import type { Card, CreateCardDto } from "../../cards/types";
import { CardPriority, CardType } from "../../cards/types";
import type { Column } from "../types";

/**
 * Valida si el nombre de una columna es válido
 */
export function isValidColumnName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 100;
}

/**
 * Limpia y formatea el nombre de una columna
 */
export function sanitizeColumnName(name: string): string {
  return name.trim();
}

/**
 * Calcula el próximo order para una nueva columna
 */
export function getNextColumnOrder(columns: Column[]): number {
  if (!columns || columns.length === 0) {
    return 1;
  }
  const maxOrder = Math.max(...columns.map((col) => col.order));
  return maxOrder + 1;
}

/**
 * Prepara los datos de la columna para envío
 */
export function prepareColumnDataForSubmission(
  name: string,
  columns?: Column[]
): { name: string; order?: number } {
  const data: { name: string; order?: number } = {
    name: sanitizeColumnName(name),
  };

  // Solo agregar order si se proporcionan las columnas existentes (para nueva columna)
  if (columns) {
    data.order = getNextColumnOrder(columns);
  }

  return data;
}

/**
 * Crea una tarjeta temporal para actualizaciones optimistas
 */
export function createTempCard(
  data: CreateCardDto,
  columnId: string,
  order: number
): Card {
  return {
    id: `temp-${Date.now()}`,
    title: data.title,
    description: data.description || "",
    comments: data.comments || "",
    dueDate: data.dueDate || undefined,
    priority: data.priority || CardPriority.MEDIUM,
    type: data.type || CardType.TASK,
    tags: data.tags || [],
    columnId: columnId,
    order: order,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Agrega una tarjeta a una columna
 */
export function addCardToColumn(column: Column, card: Card): Column {
  return {
    ...column,
    cards: [...(column.cards || []), card],
  };
}

/**
 * Remueve una tarjeta de una columna
 */
export function removeCardFromColumn(column: Column, cardId: string): Column {
  return {
    ...column,
    cards: (column.cards || []).filter((card) => card.id !== cardId),
  };
}

/**
 * Actualiza una tarjeta en una columna
 */
export function updateCardInColumn(column: Column, updatedCard: Card): Column {
  return {
    ...column,
    cards: (column.cards || []).map((card) =>
      card.id === updatedCard.id ? updatedCard : card
    ),
  };
}

/**
 * Reemplaza una tarjeta temporal con la tarjeta real
 */
export function replaceTempCardWithReal(
  column: Column,
  tempCardId: string,
  realCard: Card
): Column {
  return {
    ...column,
    cards: [
      ...(column.cards || []).filter((card) => card.id !== tempCardId),
      realCard,
    ],
  };
}

/**
 * Ordena las tarjetas de una columna por su order
 */
export function sortColumnCards(column: Column): Column {
  return {
    ...column,
    cards: (column.cards || []).sort((a, b) => a.order - b.order),
  };
}

/**
 * Calcula el próximo order para una nueva tarjeta
 */
export function getNextCardOrder(column: Column): number {
  return (column.cards?.length || 0) + 1;
}
