"use client";

import {
  DndContext,
  DragOverlay,
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
import type { Column } from "../../features/columns/types";
import { CardDisplay } from "../../features/cards/components/CardDisplay";
import { useDragDropLogic } from "../hooks/useDragDropLogic";

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
  const {
    activeCard,
    activeColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  } = useDragDropLogic({
    columns,
    onMoveCard,
    onMoveColumn,
    onDragPositionChange,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reducir la distancia para que sea más sensible
      },
    }),
    useSensor(KeyboardSensor)
  );

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
