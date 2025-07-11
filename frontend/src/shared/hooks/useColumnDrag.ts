"use client";

import { useCallback } from "react";
import { useDragStore } from "../stores/dragStore";

interface UseColumnDragParams {
  onMoveColumn: (columnId: string, newOrder: number) => Promise<void>;
  columns: Array<{ id: string; order: number }>;
}

export function useColumnDrag({ onMoveColumn, columns }: UseColumnDragParams) {
  const dragStore = useDragStore();

  const handleColumnDragStart = useCallback(
    (columnId: string) => {
      console.log("Column drag start:", columnId);
      dragStore.setColumnDragState({
        isDraggingColumn: true,
        activeColumnId: columnId,
      });
    },
    [dragStore]
  );

  const handleColumnDragOver = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      if (!dragStore.isDraggingColumn || !dragStore.activeColumnId) return;

      // Solo actualizar si el índice objetivo es diferente
      if (dragStore.targetColumnIndex !== targetIndex) {
        console.log("Drag over column index:", targetIndex);
        dragStore.setColumnDragState({
          isDraggingColumn: true,
          targetColumnIndex: targetIndex,
        });
      }
    },
    [dragStore]
  );

  const handleColumnDrop = useCallback(
    async (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      const { activeColumnId, isDraggingColumn } = dragStore;

      if (!isDraggingColumn || !activeColumnId) return;

      console.log("Dropping column at index:", targetIndex);

      try {
        // Encontrar el índice actual de la columna
        const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
        const activeColumnIndex = sortedColumns.findIndex(
          (col) => col.id === activeColumnId
        );

        if (activeColumnIndex === -1 || activeColumnIndex === targetIndex) {
          dragStore.resetColumnDragState();
          return;
        }

        // Calcular el nuevo order
        let newOrder: number;

        if (targetIndex === 0) {
          // Primer lugar
          newOrder = sortedColumns[0].order - 1000;
        } else if (targetIndex >= sortedColumns.length) {
          // Último lugar
          newOrder = sortedColumns[sortedColumns.length - 1].order + 1000;
        } else {
          // Entre columnas
          if (activeColumnIndex < targetIndex) {
            // Moviendo hacia la derecha
            const prevCol = sortedColumns[targetIndex - 1];
            const nextCol = sortedColumns[targetIndex];
            newOrder = (prevCol.order + nextCol.order) / 2;
          } else {
            // Moviendo hacia la izquierda
            const prevCol = sortedColumns[targetIndex - 1];
            const nextCol = sortedColumns[targetIndex];
            newOrder = (prevCol.order + nextCol.order) / 2;
          }
        }

        console.log(
          `Moving column from ${activeColumnIndex} to ${targetIndex}, new order: ${newOrder}`
        );

        await onMoveColumn(activeColumnId, newOrder);
      } catch (error) {
        console.error("Error moving column:", error);
      } finally {
        dragStore.resetColumnDragState();
      }
    },
    [dragStore, columns, onMoveColumn]
  );

  const handleColumnDragEnd = useCallback(() => {
    dragStore.resetColumnDragState();
  }, [dragStore]);

  return {
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
    handleColumnDragEnd,
    isDraggingColumn: dragStore.isDraggingColumn,
    activeColumnId: dragStore.activeColumnId,
    targetColumnIndex: dragStore.targetColumnIndex,
  };
}
