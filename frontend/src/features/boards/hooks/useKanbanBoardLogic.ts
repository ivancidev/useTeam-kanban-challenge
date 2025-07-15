"use client";

import { useState } from "react";
import { useDragStore } from "@/shared/stores/dragStore";
import { useBoard } from "./useBoard";
import type {
  Column,
  CreateColumnDto,
  UpdateColumnDto,
} from "../../columns/types";

/**
 * Hook personalizado que maneja toda la lógica de negocio del tablero Kanban.
 * Separa la lógica de la interfaz de usuario para mejor mantenibilidad.
 *
 * @returns Objeto con estado y funciones para manejar el tablero Kanban
 */
export function useKanbanBoardLogic() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  const {
    columns,
    isLoading,
    error,
    createColumn,
    editColumn,
    deleteColumn,
    loadBoard,
    moveCard,
    moveColumn,
    updateColumnState,
  } = useBoard();

  const dragStore = useDragStore();

  // Función para determinar si mostrar indicador de drop
  const shouldShowDropIndicator = (columnId: string, position: number) => {
    return (
      dragStore.isDragging &&
      dragStore.targetColumnId === columnId &&
      dragStore.insertPosition === position
    );
  };

  const handleCreateColumn = async (data: CreateColumnDto) => {
    await createColumn(data);
    setShowCreateDialog(false);

    // Hacer scroll al final para mostrar la nueva columna
    setTimeout(() => {
      const scrollElement = document.querySelector(
        ".kanban-horizontal-scroll"
      ) as HTMLElement;
      if (scrollElement) {
        scrollElement.scrollTo({
          left: scrollElement.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  const handleEditColumn = async (data: UpdateColumnDto) => {
    if (!editingColumn) return;
    await editColumn(editingColumn.id, data);
    setEditingColumn(null);
  };

  const handleDeleteColumn = async (columnId: string) => {
    await deleteColumn(columnId);
  };

  const handleMoveCard = async (
    cardId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    await moveCard(cardId, targetColumnId, newOrder);
  };

  const handleColumnUpdate = (updatedColumn: Column) => {
    updateColumnState(updatedColumn);
  };

  const openCreateDialog = () => setShowCreateDialog(true);
  const closeCreateDialog = () => setShowCreateDialog(false);
  const openEditDialog = (column: Column) => setEditingColumn(column);
  const closeEditDialog = () => setEditingColumn(null);

  const handleDragPositionChange = (state: {
    isDragging: boolean;
    activeCardId: string | null;
    targetColumnId: string | null;
    insertPosition: number | null;
  }) => {
    dragStore.setDragState(state);
  };

  return {
    columns,
    isLoading,
    error,
    showCreateDialog,
    editingColumn,
    loadBoard,
    moveColumn,
    shouldShowDropIndicator,
    handleCreateColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleColumnUpdate,
    handleMoveCard,
    openCreateDialog,
    closeCreateDialog,
    openEditDialog,
    closeEditDialog,
    handleDragPositionChange,

    dragState: {
      isDragging: dragStore.isDragging,
      activeCardId: dragStore.activeCardId,
      targetColumnId: dragStore.targetColumnId,
      insertPosition: dragStore.insertPosition,
    },
  };
}
