"use client";

import { useState } from "react";
import { DragEndEvent, DragStartEvent, DragOverEvent } from "@dnd-kit/core";
import type { Card } from "../../features/cards/types";
import type { Column } from "../../features/columns/types";
import { useDragStore } from "../stores/dragStore";
import { calculateDropPosition } from "../utils/dragCalculations";

interface UseDragDropLogicProps {
  columns: Column[];
  onMoveCard: (
    cardId: string,
    targetColumnId: string,
    newOrder: number
  ) => void;
  onMoveColumn?: (columnId: string, newOrder: number) => void;
  onDragPositionChange?: (dragState: {
    isDragging: boolean;
    activeCardId: string | null;
    targetColumnId: string | null;
    insertPosition: number | null;
  }) => void;
}

/**
 * Hook personalizado para manejar toda la lógica de drag and drop del Kanban
 * Gestiona el arrastrar y soltar de tarjetas y columnas con cálculos de posición
 */
export function useDragDropLogic({
  columns,
  onMoveCard,
  onMoveColumn,
  onDragPositionChange,
}: UseDragDropLogicProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const dragStore = useDragStore();

  /**
   * Maneja el inicio del arrastre de tarjetas o columnas
   * Identifica si es una tarjeta o columna y configura el estado inicial
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Verificar si es una columna siendo arrastrada
    if (activeId.startsWith("column-")) {
      const columnId = activeId.replace("column-", "");
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        setActiveColumn(column);
        return;
      }
    }

    // De lo contrario, es una tarjeta siendo arrastrada
    const activeCardId = activeId;

    // Encontrar la tarjeta que se está arrastrando
    for (const column of columns) {
      const card = column.cards?.find((c: Card) => c.id === active.id);
      if (card) {
        setActiveCard(card);
        break;
      }
    }

    // Establecer estado de arrastre en el store
    dragStore.setDragState({
      isDragging: true,
      activeCardId,
      targetColumnId: null,
      insertPosition: null,
      calculatedOrder: null,
    });

    // También notificar al padre para compatibilidad hacia atrás
    onDragPositionChange?.({
      isDragging: true,
      activeCardId,
      targetColumnId: null,
      insertPosition: null,
    });
  };

  /**
   * Maneja el final del arrastre y ejecuta el movimiento final
   * Calcula la nueva posición y ejecuta las funciones de callback correspondientes
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    const activeId = active.id as string;

    // Verificar si es una columna siendo movida
    if (activeId.startsWith("column-") && over) {
      const overId = over.id as string;

      if (overId.startsWith("column-") && activeId !== overId) {
        const activeColumnId = activeId.replace("column-", "");
        const overColumnId = overId.replace("column-", "");

        // Obtener columnas ordenadas para entender el orden actual
        const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
        const activeColumn = sortedColumns.find(
          (col) => col.id === activeColumnId
        );
        const overColumn = sortedColumns.find((col) => col.id === overColumnId);

        if (!activeColumn || !overColumn) return;

        const activeIndex = sortedColumns.findIndex(
          (col) => col.id === activeColumnId
        );
        const overIndex = sortedColumns.findIndex(
          (col) => col.id === overColumnId
        );

        if (
          activeIndex !== -1 &&
          overIndex !== -1 &&
          activeIndex !== overIndex
        ) {
          // Calcular el nuevo orden basado en la posición de soltar
          let newOrder: number;

          // Quitar la columna activa del array para simular el soltar
          const columnsWithoutActive = sortedColumns.filter(
            (col) => col.id !== activeColumnId
          );

          if (overIndex === 0) {
            // Soltando al principio
            newOrder = columnsWithoutActive[0].order - 1000;
          } else if (overIndex >= columnsWithoutActive.length) {
            // Soltando al final
            newOrder =
              columnsWithoutActive[columnsWithoutActive.length - 1].order +
              1000;
          } else {
            // Soltando entre dos columnas
            const targetIndex =
              overIndex > activeIndex ? overIndex - 1 : overIndex;

            if (targetIndex === 0) {
              newOrder = columnsWithoutActive[0].order - 1000;
            } else if (targetIndex >= columnsWithoutActive.length - 1) {
              newOrder =
                columnsWithoutActive[columnsWithoutActive.length - 1].order +
                1000;
            } else {
              const prevOrder = columnsWithoutActive[targetIndex - 1].order;
              const nextOrder = columnsWithoutActive[targetIndex].order;
              newOrder = (prevOrder + nextOrder) / 2;
            }
          }
          onMoveColumn?.(activeColumnId, newOrder);
        }
      }
      return;
    }

    // Manejar el final del arrastre de tarjetas (lógica existente)
    const calculatedOrder = dragStore.calculatedOrder;
    const targetColumnId = dragStore.targetColumnId;

    // Resetear estado de arrastre
    dragStore.resetDragState();

    // Notificar al padre sobre el final del arrastre
    setTimeout(() => {
      onDragPositionChange?.({
        isDragging: false,
        activeCardId: null,
        targetColumnId: null,
        insertPosition: null,
      });
    }, 50);

    if (!over || !calculatedOrder || !targetColumnId) return;

    const activeCardId = activeId;

    // Encontrar la columna y tarjeta de origen
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

    // Usar el orden pre-calculado del store para consistencia
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    if (!targetColumn) return;

    // Solo mover si realmente hay un cambio
    if (
      sourceColumn.id !== targetColumnId ||
      Math.abs(sourceCard.order - calculatedOrder) > 0.1
    ) {
      onMoveCard(activeCardId, targetColumnId, calculatedOrder);
    }
  };

  /**
   * Maneja el evento de arrastre sobre elementos
   * Calcula la posición de inserción y actualiza el estado visual
   */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    // Usar la función de cálculo consistente
    const dropCalc = calculateDropPosition(overId, columns, activeCardId);

    if (!dropCalc.targetColumn) return;

    const currentState = dragStore;

    // Solo actualizar si la posición cambió
    if (
      currentState.targetColumnId !== dropCalc.targetColumn.id ||
      currentState.insertPosition !== dropCalc.insertAtIndex
    ) {
      // Actualizar store con cálculos consistentes
      dragStore.setDragState({
        isDragging: true,
        activeCardId,
        targetColumnId: dropCalc.targetColumn.id,
        insertPosition: dropCalc.insertAtIndex,
        calculatedOrder: dropCalc.newOrder,
      });

      // También notificar al padre para compatibilidad hacia atrás
      onDragPositionChange?.({
        isDragging: true,
        activeCardId,
        targetColumnId: dropCalc.targetColumn.id,
        insertPosition: dropCalc.insertAtIndex,
      });
    }
  };

  return {
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
