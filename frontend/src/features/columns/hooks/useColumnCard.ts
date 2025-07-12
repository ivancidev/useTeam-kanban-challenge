"use client";

import { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useCards } from "../../cards/hooks/useCards";
import { useDeleteConfirmation } from "../../../shared/hooks/useDeleteConfirmation";
import { useColumnDragHandle } from "../../../shared/hooks/useColumnDragHandle";
import {
  createTempCard,
  addCardToColumn,
  removeCardFromColumn,
  updateCardInColumn,
  replaceTempCardWithReal,
  sortColumnCards,
  getNextCardOrder,
} from "../helpers";
import type {
  Card as CardType,
  CreateCardDto,
  UpdateCardDto,
} from "../../cards/types";
import { UseColumnCardProps } from "../types";
export function useColumnCard({
  column,
  index,
  onEdit,
  onDelete,
  onColumnUpdate,
  isLoading = false,
  shouldShowDropIndicator,
  dragState,
}: UseColumnCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateCardDialog, setShowCreateCardDialog] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [cardCount, setCardCount] = useState(column.cards?.length || 0);
  const [lastCardOperation, setLastCardOperation] = useState<
    "create" | "drag" | null
  >(null);

  // Calcular si hay alguna operación en progreso
  const isAnyOperationInProgress = isLoading || isDeleting;

  // Referencias
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Hooks especializados
  const { createCard, updateCard, deleteCard } = useCards();
  const {
    pendingDeleteId,
    isConfirmOpen,
    requestDelete,
    confirmDelete,
    cancelDelete,
  } = useDeleteConfirmation();

  // Hook para el drag de columnas
  const {
    dragRef,
    dragHandleProps,
    style: dragStyle,
    isDragging,
  } = useColumnDragHandle({
    columnId: column.id,
    index,
  });

  // Droppable para la columna
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  // Droppable para el área de tarjetas
  const { setNodeRef: setCardDropRef } = useDroppable({
    id: `${column.id}-cards`,
  });

  // Combinar las refs para que funcionen tanto el drop como el drag
  const setNodeRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    dragRef(node);
  };

  // Auto-scroll para nuevas tarjetas
  useEffect(() => {
    const newCardCount = column.cards?.length || 0;

    const isDraggingActive = dragState?.isDragging || false;
    const cardCountDecreased = newCardCount < cardCount;
    const cardCountIncreased = newCardCount > cardCount;

    const shouldAutoScroll =
      cardCountIncreased &&
      !isDraggingActive &&
      !cardCountDecreased &&
      lastCardOperation === "create";

    if (shouldAutoScroll && cardsContainerRef.current) {
      setTimeout(() => {
        if (cardsContainerRef.current && !dragState?.isDragging) {
          cardsContainerRef.current.scrollTo({
            top: cardsContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 150);
    }

    setCardCount(newCardCount);

    if (lastCardOperation) {
      const resetTimer = setTimeout(() => setLastCardOperation(null), 300);
      return () => clearTimeout(resetTimer);
    }
  }, [
    column.cards?.length,
    cardCount,
    dragState?.isDragging,
    lastCardOperation,
  ]);

  // Efecto para manejar cambios en el estado de drag
  useEffect(() => {
    if (dragState?.isDragging && dragState?.targetColumnId === column.id) {
      setLastCardOperation("drag");
    }
  }, [dragState?.isDragging, dragState?.targetColumnId, column.id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(column.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete column:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCard = async (data: CreateCardDto) => {
    // Prevenir creación si hay operaciones en progreso
    if (isAnyOperationInProgress) {
      console.warn("Cannot create card: operation in progress");
      return;
    }

    setLastCardOperation("create");

    // Crear tarjeta temporal usando helper
    const tempCard = createTempCard(data, column.id, getNextCardOrder(column));

    // Actualización optimista usando helper
    if (onColumnUpdate) {
      const updatedColumn = addCardToColumn(column, tempCard);
      onColumnUpdate(updatedColumn);
    }

    try {
      const newCard = await createCard(data);
      if (newCard && onColumnUpdate) {
        // Reemplazar tarjeta temporal con la real usando helper
        const updatedColumn = replaceTempCardWithReal(
          column,
          tempCard.id,
          newCard
        );
        onColumnUpdate(updatedColumn);
      }
      setShowCreateCardDialog(false);
    } catch (error) {
      // Rollback usando helper
      if (onColumnUpdate) {
        const updatedColumn = removeCardFromColumn(column, tempCard.id);
        onColumnUpdate(updatedColumn);
      }
      console.error("Failed to create card:", error);
    }
  };

  const handleEditCard = async (data: UpdateCardDto) => {
    if (!editingCard) return;

    // Prevenir edición si hay operaciones en progreso
    if (isAnyOperationInProgress) {
      console.warn("Cannot edit card: operation in progress");
      return;
    }

    const updatedCard = await updateCard(editingCard.id, data);
    if (updatedCard && onColumnUpdate) {
      // Actualizar la columna usando helper
      const updatedColumn = updateCardInColumn(column, updatedCard);
      onColumnUpdate(updatedColumn);
      setEditingCard(updatedCard);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    // Prevenir eliminación si hay operaciones en progreso
    if (isAnyOperationInProgress) {
      console.warn("Cannot delete card: operation in progress");
      return;
    }
    // Actualización optimista usando helper
    if (onColumnUpdate) {
      const updatedColumn = removeCardFromColumn(column, cardId);
      onColumnUpdate(updatedColumn);
    }

    try {
      const success = await deleteCard(cardId);
      if (!success) {
        // Rollback usando helper - restaurar la columna ordenada
        const revertedColumn = sortColumnCards(column);
        if (onColumnUpdate) {
          onColumnUpdate(revertedColumn);
        }
      }
    } catch (error) {
      // Rollback usando helper - restaurar la columna ordenada
      const revertedColumn = sortColumnCards(column);
      if (onColumnUpdate) {
        onColumnUpdate(revertedColumn);
      }
      console.error("Failed to delete card:", error);
    }
  };

  const handleDeleteRequest = (cardId: string) => {
    requestDelete(cardId);
  };

  const handleConfirmDelete = async () => {
    const cardId = confirmDelete();
    if (cardId) {
      await handleDeleteCard(cardId);
    }
  };

  const handleEditColumn = () => {
    onEdit(column);
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleOpenCreateCardDialog = () => {
    // Solo abrir si no hay operaciones en progreso
    if (!isAnyOperationInProgress) {
      setShowCreateCardDialog(true);
    }
  };

  const handleCloseCreateCardDialog = () => {
    setShowCreateCardDialog(false);
  };

  const handleOpenEditCard = (card: CardType) => {
    // Solo abrir si no hay operaciones en progreso
    if (!isAnyOperationInProgress) {
      setEditingCard(card);
    }
  };

  const handleCloseEditCard = () => {
    setEditingCard(null);
  };

  const setCardsContainerRef = (node: HTMLDivElement | null) => {
    cardsContainerRef.current = node;
    setCardDropRef(node);
  };

  return {
    showDeleteDialog,
    isDeleting,
    showCreateCardDialog,
    editingCard,
    cardCount,
    isOver,
    isDragging,
    pendingDeleteId,
    isConfirmOpen,
    setNodeRef,
    setCardsContainerRef,
    dragHandleProps,
    dragStyle,
    handleDelete,
    handleCreateCard,
    handleEditCard,
    handleDeleteCard,
    handleDeleteRequest,
    handleConfirmDelete,
    handleEditColumn,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenCreateCardDialog,
    handleCloseCreateCardDialog,
    handleOpenEditCard,
    handleCloseEditCard,
    cancelDelete,
    shouldShowDropIndicator,
  };
}
