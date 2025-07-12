import type { Column } from "../types";

/**
 * Actualiza el orden de una columna específica
 */
export const updateColumnOrder = (
  columns: Column[],
  columnId: string,
  optimisticColumn: Column
): Column[] => {
  return columns
    .map((col) => (col.id === columnId ? optimisticColumn : col))
    .sort((a, b) => a.order - b.order);
};

/**
 * Revierte el orden de una columna (rollback)
 */
export const rollbackColumnOrder = (
  columns: Column[],
  columnId: string,
  originalColumn: Column
): Column[] => {
  return columns
    .map((col) => (col.id === columnId ? originalColumn : col))
    .sort((a, b) => a.order - b.order);
};

/**
 * Verifica si un movimiento de columna es realmente necesario
 */
export const isColumnMovementRequired = (
  currentOrder: number,
  newOrder: number
): boolean => {
  return Math.abs(currentOrder - newOrder) >= 0.001;
};
