import type { Card, CreateCardDto } from "../../cards/types";
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
 * Prepara los datos de la columna para envío
 */
export function prepareColumnDataForSubmission(name: string): { name: string } {
  return {
    name: sanitizeColumnName(name),
  };
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

/**
 * Verifica si la columna está vacía
 */
export function isColumnEmpty(column: Column): boolean {
  return !column.cards || column.cards.length === 0;
}

/**
 * Cuenta las tarjetas en una columna
 */
export function getCardCount(column: Column): number {
  return column.cards?.length || 0;
}

/**
 * Busca una tarjeta en una columna por ID
 */
export function findCardInColumn(
  column: Column,
  cardId: string
): Card | undefined {
  return column.cards?.find((card) => card.id === cardId);
}
