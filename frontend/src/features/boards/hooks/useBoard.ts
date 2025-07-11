"use client";

import { useState, useEffect } from "react";
import { boardsApi } from "../services/api";
import { columnsApi } from "../../columns/services/api";
import { cardsApi } from "../../cards/services/api";
import { useNotifications } from "../../../shared/hooks/useNotifications";
import type { Board } from "../types";
import type {
  Column,
  CreateColumnDto,
  UpdateColumnDto,
} from "../../columns/types";
import type {
  Card,
  CreateCardDto,
  UpdateCardDto,
  MoveCardDto,
} from "../../cards/types";

export function useBoard() {
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotifications();

  const loadBoard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create default board
      const board = await boardsApi.getDefaultBoard();
      setCurrentBoard(board);

      // Load columns for this board
      const boardColumns = await columnsApi.getColumns(board.id);
      setColumns(boardColumns);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load board";
      setError(errorMessage);
      console.error("Error loading board:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createColumn = async (data: CreateColumnDto) => {
    if (!currentBoard) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add boardId to the data
      const columnData = { ...data, boardId: currentBoard.id };
      const newColumn = await columnsApi.createColumn(columnData);

      // Add to local state
      setColumns((prev) => [...prev, newColumn]);
      notifySuccess("Columna creada exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create column";
      setError(errorMessage);
      notifyError("Error al crear la columna");
      console.error("Error creating column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const editColumn = async (id: string, data: UpdateColumnDto) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedColumn = await columnsApi.updateColumn(id, data);
      // Update local state
      setColumns((prev) =>
        prev.map((col) => (col.id === id ? updatedColumn : col))
      );
      notifySuccess("Columna actualizada exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update column";
      setError(errorMessage);
      notifyError("Error al actualizar la columna");
      console.error("Error updating column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteColumn = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await columnsApi.deleteColumn(id);
      // Remove from local state
      setColumns((prev) => prev.filter((col) => col.id !== id));
      notifySuccess("Columna eliminada exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete column";
      setError(errorMessage);
      notifyError("Error al eliminar la columna");
      console.error("Error deleting column:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const moveCard = async (
    cardId: string,
    targetColumnId: string,
    newOrder: number
  ) => {
    // Find the current card and its position
    let currentCard: Card | null = null;
    let currentColumnId: string | null = null;
    let currentOrder: number | null = null;

    for (const column of columns) {
      const card = column.cards?.find((c) => c.id === cardId);
      if (card) {
        currentCard = card;
        currentColumnId = column.id;
        currentOrder = card.order;
        break;
      }
    }

    if (!currentCard) {
      console.error("Card not found:", cardId);
      return;
    }

    // Check if this is actually a move (different column or different order)
    const isSameColumn = currentColumnId === targetColumnId;
    const isSameOrder = Math.abs((currentOrder || 0) - newOrder) < 0.001; // Use small epsilon for decimal comparison

    if (isSameColumn && isSameOrder) {
      console.log("Card already in the same position, skipping move");
      return; // No notification, no API call
    }

    console.log(
      "Moving card:",
      cardId,
      "from column:",
      currentColumnId,
      "order:",
      currentOrder,
      "to column:",
      targetColumnId,
      "order:",
      newOrder
    );

    // OPTIMISTIC UPDATE: Update UI immediately for responsive feel
    const optimisticCard = {
      ...currentCard,
      columnId: targetColumnId,
      order: newOrder,
    };

    setColumns((prevColumns) => {
      return prevColumns.map((column) => {
        if (column.id === targetColumnId) {
          // Add or update card in target column
          const cardExists = column.cards?.some((card) => card.id === cardId);
          if (!cardExists) {
            return {
              ...column,
              cards: [...(column.cards || []), optimisticCard].sort(
                (a, b) => a.order - b.order
              ),
            };
          } else {
            return {
              ...column,
              cards: (column.cards || [])
                .map((card) => (card.id === cardId ? optimisticCard : card))
                .sort((a, b) => a.order - b.order),
            };
          }
        } else {
          // Remove card from other columns
          return {
            ...column,
            cards: (column.cards || []).filter((card) => card.id !== cardId),
          };
        }
      });
    });

    // Now make the API call in the background
    try {
      const moveData: MoveCardDto = {
        columnId: targetColumnId,
        order: newOrder,
      };

      const movedCard = await cardsApi.moveCard(cardId, moveData);
      console.log("Card moved successfully on backend:", movedCard);

      // Update with the actual server response (in case of any server-side changes)
      setColumns((prevColumns) => {
        return prevColumns.map((column) => {
          if (column.id === targetColumnId) {
            return {
              ...column,
              cards: (column.cards || [])
                .map((card) => (card.id === cardId ? movedCard : card))
                .sort((a, b) => a.order - b.order),
            };
          }
          return column;
        });
      });

      // Only show success notification for meaningful moves (between columns)
      if (!isSameColumn) {
        notifySuccess("Tarjeta movida exitosamente");
      }
    } catch (err) {
      // ROLLBACK: Revert optimistic update on error
      console.error("Error moving card, rolling back:", err);

      setColumns((prevColumns) => {
        return prevColumns.map((column) => {
          if (column.id === currentColumnId) {
            const cardExists = column.cards?.some((card) => card.id === cardId);
            if (!cardExists) {
              return {
                ...column,
                cards: [...(column.cards || []), currentCard].sort(
                  (a, b) => a.order - b.order
                ),
              };
            } else {
              return {
                ...column,
                cards: (column.cards || [])
                  .map((card) => (card.id === cardId ? currentCard : card))
                  .sort((a, b) => a.order - b.order),
              };
            }
          } else if (column.id === targetColumnId) {
            // Remove card from target column where it was optimistically placed
            return {
              ...column,
              cards: (column.cards || []).filter((card) => card.id !== cardId),
            };
          }
          return column;
        });
      });

      const errorMessage =
        err instanceof Error ? err.message : "Failed to move card";
      setError(errorMessage);
      notifyError("Error al mover la tarjeta");
      throw err;
    }
  };

  const updateColumnState = (updatedColumn: Column) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === updatedColumn.id ? updatedColumn : col
      )
    );
  };

  // Load board on mount
  useEffect(() => {
    loadBoard();
  }, []);

  return {
    currentBoard,
    columns,
    isLoading,
    error,
    loadBoard,
    createColumn,
    editColumn,
    deleteColumn,
    moveCard,
    updateColumnState,
    clearError,
  };
}
