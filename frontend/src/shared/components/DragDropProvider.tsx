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
  onDragPositionChange,
}: DragDropProviderProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const dragStore = useDragStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reducir la distancia para mayor sensibilidad
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeCardId = active.id as string;

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

    const activeCardId = active.id as string;

    // Obtener los valores calculados del store
    const calculatedOrder = dragStore.calculatedOrder;
    const targetColumnId = dragStore.targetColumnId;

    // Reset drag state
    dragStore.resetDragState();

    // Notificar que terminó el drag
    onDragPositionChange?.({
      isDragging: false,
      activeCardId: null,
      targetColumnId: null,
      insertPosition: null,
    });

    // Si no hay valores válidos, salir
    if (!over || calculatedOrder === null || !targetColumnId) return;

    // Buscar la tarjeta original para verificar si realmente cambió
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

    // Solo mover si hay un cambio real
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

    // Calcular SIEMPRE la posición para que el indicador se mueva correctamente
    const dropCalc = calculateDropPosition(overId, columns, activeCardId);

    if (!dropCalc.targetColumn) return;

    // Actualizar SIEMPRE para que el indicador se mueva
    dragStore.setDragState({
      isDragging: true,
      activeCardId,
      targetColumnId: dropCalc.targetColumn.id,
      insertPosition: dropCalc.insertAtIndex,
      calculatedOrder: dropCalc.newOrder,
    });

    // Notificar al parent SIEMPRE
    onDragPositionChange?.({
      isDragging: true,
      activeCardId,
      targetColumnId: dropCalc.targetColumn.id,
      insertPosition: dropCalc.insertAtIndex,
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      {children}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? (
          <CardDisplay card={activeCard} className="shadow-lg opacity-90" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
