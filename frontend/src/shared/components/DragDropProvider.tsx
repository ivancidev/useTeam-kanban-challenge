"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import type { Card } from "../../features/cards/types";
import type { Column } from "../../features/columns/types";
import { CardDisplay } from "../../features/cards/components/CardDisplay";
import { useDragStore } from "../stores/dragStore";
import { calculateDropPosition } from "../utils/dragCalculations";

interface DragDropProviderProps {
  children: React.ReactNode;
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
  onMoveColumn,
  onDragPositionChange,
}: DragDropProviderProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const dragStore = useDragStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reducir la distancia para que sea más sensible
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as string;

    // Check if it's a column being dragged
    if (activeId.startsWith("column-")) {
      const columnId = activeId.replace("column-", "");
      const column = columns.find((col) => col.id === columnId);
      if (column) {
        setActiveColumn(column);
        return;
      }
    }

    // Otherwise, it's a card being dragged
    const activeCardId = activeId;

    // Find the card being dragged
    for (const column of columns) {
      const card = column.cards?.find((c: Card) => c.id === active.id);
      if (card) {
        setActiveCard(card);
        break;
      }
    }

    // Set drag state in store
    dragStore.setDragState({
      isDragging: true,
      activeCardId,
      targetColumnId: null,
      insertPosition: null,
      calculatedOrder: null,
    });

    // Also notify parent for backward compatibility
    onDragPositionChange?.({
      isDragging: true,
      activeCardId,
      targetColumnId: null,
      insertPosition: null,
    });
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    const activeId = active.id as string;

    // Check if it's a column being moved
    if (activeId.startsWith("column-") && over) {
      const overId = over.id as string;

      if (overId.startsWith("column-") && activeId !== overId) {
        const activeColumnId = activeId.replace("column-", "");
        const overColumnId = overId.replace("column-", "");

        // Get sorted columns to understand current order
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
          // Calculate the new order based on drop position
          let newOrder: number;

          // Remove the active column from the array to simulate the drop
          const columnsWithoutActive = sortedColumns.filter(
            (col) => col.id !== activeColumnId
          );

          if (overIndex === 0) {
            // Dropping at the beginning
            newOrder = columnsWithoutActive[0].order - 1000;
          } else if (overIndex >= columnsWithoutActive.length) {
            // Dropping at the end
            newOrder =
              columnsWithoutActive[columnsWithoutActive.length - 1].order +
              1000;
          } else {
            // Dropping between two columns
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

    // Handle card drag end (existing logic)
    const calculatedOrder = dragStore.calculatedOrder;
    const targetColumnId = dragStore.targetColumnId;

    // Reset drag state
    dragStore.resetDragState();

    // Notify parent about drag end
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

    // Use the pre-calculated order from the store for consistency
    const targetColumn = columns.find((col) => col.id === targetColumnId);
    if (!targetColumn) return;

    // Only move if there's actually a change
    if (
      sourceColumn.id !== targetColumnId ||
      Math.abs(sourceCard.order - calculatedOrder) > 0.1
    ) {
      onMoveCard(activeCardId, targetColumnId, calculatedOrder);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const activeCardId = active.id as string;
    const overId = over.id as string;

    // Use the consistent calculation function
    const dropCalc = calculateDropPosition(overId, columns, activeCardId);

    if (!dropCalc.targetColumn) return;

    const currentState = dragStore;

    // Only update if position changed
    if (
      currentState.targetColumnId !== dropCalc.targetColumn.id ||
      currentState.insertPosition !== dropCalc.insertAtIndex
    ) {
      // Update store with consistent calculations
      dragStore.setDragState({
        isDragging: true,
        activeCardId,
        targetColumnId: dropCalc.targetColumn.id,
        insertPosition: dropCalc.insertAtIndex,
        calculatedOrder: dropCalc.newOrder,
      });

      // Also notify parent for backward compatibility
      onDragPositionChange?.({
        isDragging: true,
        activeCardId,
        targetColumnId: dropCalc.targetColumn.id,
        insertPosition: dropCalc.insertAtIndex,
      });
    }
  };

  const columnIds = columns.map((col) => `column-${col.id}`);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <SortableContext
        items={columnIds}
        strategy={horizontalListSortingStrategy}
      >
        {children}
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? (
          <CardDisplay card={activeCard} className="shadow-lg opacity-90" />
        ) : activeColumn ? (
          <div className="w-80 h-96 bg-white border rounded-lg shadow-lg opacity-90">
            <div className="p-4 border-b">
              <h3 className="font-semibold">{activeColumn.name}</h3>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
