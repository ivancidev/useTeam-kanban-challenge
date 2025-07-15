"use client";

import { useState, useEffect, useCallback } from "react";

import { useNotifications } from "@/shared/hooks/useNotifications";
import { useRealtimeSync } from "@/shared/hooks/useRealtimeSync";
import { userActionTracker } from "@/shared/utils/userActionTracker";

import { boardsApi } from "../services/api";
import {
  createAsyncHandler,
  createOptimisticHandler,
  updateColumnsWithCard,
  rollbackCardMove,
  findCardInColumns,
  isCardMovementRequired,
  updateColumnOrder,
  rollbackColumnOrder,
  isColumnMovementRequired,
} from "../helpers";
import { useBoardRealtimeHandlers } from "./useBoardRealtimeHandlers";
import { columnsApi } from "../../columns/services/api";
import { cardsApi } from "../../cards/services/api";

import type { Board } from "../types";
import type { MoveCardDto } from "../../cards/types";
import type {
  Column,
  CreateColumnDto,
  UpdateColumnDto,
} from "../../columns/types";

export function useBoard() {
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotifications();

  // Crear handlers reutilizables
  const asyncHandler = createAsyncHandler(
    setIsLoading,
    setError,
    notifySuccess,
    notifyError
  );

  const loadBoard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener un tablero predeterminado
      const board = await boardsApi.getDefaultBoard();
      setCurrentBoard(board);

      const boardColumns = await columnsApi.getColumns(board.id);
      setColumns(boardColumns);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el tablero";
      setError(message);
      console.error("Error cargando el tablero:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createColumn = useCallback(
    async (data: CreateColumnDto) => {
      if (!currentBoard) return;

      const columnData = { ...data, boardId: currentBoard.id };

      try {
        const result = await asyncHandler(
          () => columnsApi.createColumn(columnData),
          "Columna creada exitosamente",
          "Error al crear la columna"
        );

        // Marcar la acción del usuario con el ID real de la columna creada
        if (result) {
          userActionTracker.markAction("column-created", result.id);

          // Actualizar el estado local inmediatamente para reflejar la nueva columna
          setColumns((prev) => {
            // Verificar si la columna ya existe para evitar duplicados
            const exists = prev.find((col) => col.id === result.id);
            if (exists) return prev;

            return [...prev, result].sort((a, b) => a.order - b.order);
          });
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
    [currentBoard, asyncHandler]
  );

  const editColumn = useCallback(
    async (id: string, data: UpdateColumnDto) => {
      // Marcar la acción del usuario antes de realizar la actualización
      userActionTracker.markAction("column-updated", id);

      await asyncHandler(
        () => columnsApi.updateColumn(id, data),
        "Columna actualizada exitosamente",
        "Error al actualizar la columna"
      );
    },
    [asyncHandler]
  );

  const deleteColumn = useCallback(
    async (id: string) => {
      // Marcar la acción del usuario antes de realizar la eliminación
      userActionTracker.markAction("column-deleted", id);

      await asyncHandler(
        () => columnsApi.deleteColumn(id),
        "Columna eliminada exitosamente",
        "Error al eliminar la columna"
      );
    },
    [asyncHandler]
  );

  const clearError = () => {
    setError(null);
  };

  const moveCard = useCallback(
    async (cardId: string, targetColumnId: string, newOrder: number) => {
      // Encontrar la tarjeta actual usando el helper
      const {
        card: currentCard,
        columnId: currentColumnId,
        order: currentOrder,
      } = findCardInColumns(columns, cardId);

      if (!currentCard) {
        console.error("Card not found:", cardId);
        return;
      }

      // Verificar si realmente es un movimiento usando el helper
      if (
        !isCardMovementRequired(
          currentColumnId,
          targetColumnId,
          currentOrder,
          newOrder
        )
      ) {
        return;
      }

      const optimisticCard = {
        ...currentCard,
        columnId: targetColumnId,
        order: newOrder,
      };

      // Crear handler optimista
      const optimisticHandler = createOptimisticHandler(
        setError,
        notifySuccess,
        notifyError
      );

      // Función para la actualización optimista
      const optimisticUpdate = () => {
        setColumns((prevColumns) =>
          updateColumnsWithCard(
            prevColumns,
            cardId,
            targetColumnId,
            optimisticCard
          )
        );
      };

      // Función para el rollback
      const rollback = () => {
        setColumns((prevColumns) =>
          rollbackCardMove(
            prevColumns,
            cardId,
            currentColumnId,
            targetColumnId,
            currentCard
          )
        );
      };

      // Llamada a la API
      const apiCall = async () => {
        const moveData: MoveCardDto = {
          columnId: targetColumnId,
          order: newOrder,
        };
        return await cardsApi.moveCard(cardId, moveData);
      };

      const isSameColumn = currentColumnId === targetColumnId;

      await optimisticHandler(
        optimisticUpdate,
        apiCall,
        rollback,
        !isSameColumn ? "Tarjeta movida exitosamente" : undefined,
        "Error al mover la tarjeta"
      );
    },
    [columns, notifySuccess, notifyError]
  );

  const updateColumnState = (updatedColumn: Column) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === updatedColumn.id ? updatedColumn : col
      )
    );
  };

  const moveColumn = useCallback(
    async (columnId: string, newOrder: number) => {
      const currentColumn = columns.find((col) => col.id === columnId);
      if (!currentColumn) {
        console.error("Column not found:", columnId);
        return;
      }

      // Verificar si realmente es un movimiento
      if (!isColumnMovementRequired(currentColumn.order, newOrder)) {
        return;
      }

      const optimisticColumn = { ...currentColumn, order: newOrder };

      // Crear handler optimista
      const optimisticHandler = createOptimisticHandler(
        setError,
        notifySuccess,
        notifyError
      );

      // Función para la actualización optimista
      const optimisticUpdate = () => {
        setColumns((prevColumns) =>
          updateColumnOrder(prevColumns, columnId, optimisticColumn)
        );
      };

      // Función para el rollback
      const rollback = () => {
        setColumns((prevColumns) =>
          rollbackColumnOrder(prevColumns, columnId, currentColumn)
        );
      };

      const apiCall = async () => {
        return await columnsApi.updateColumn(columnId, {
          order: newOrder,
        });
      };

      await optimisticHandler(
        optimisticUpdate,
        apiCall,
        rollback,
        "Columna reordenada exitosamente",
        "Error al reordenar la columna"
      );
    },
    [columns, notifySuccess, notifyError]
  );

  // Usar el hook de manejadores en tiempo real
  const realtimeHandlers = useBoardRealtimeHandlers(setColumns);

  // Configurar sincronización en tiempo real
  const realtimeSync = useRealtimeSync({
    boardId: currentBoard?.id || "",
    onColumnCreated: realtimeHandlers.handleRealtimeColumnCreated,
    onColumnUpdated: realtimeHandlers.handleRealtimeColumnUpdated,
    onColumnDeleted: realtimeHandlers.handleRealtimeColumnDeleted,
    onCardCreated: realtimeHandlers.handleRealtimeCardCreated,
    onCardUpdated: realtimeHandlers.handleRealtimeCardUpdated,
    onCardMoved: realtimeHandlers.handleRealtimeCardMoved,
    onCardDeleted: realtimeHandlers.handleRealtimeCardDeleted,
  });

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

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
    moveColumn,
    updateColumnState,
    clearError,
    realtime: {
      isConnected: realtimeSync.isConnected,
      isReconnecting: realtimeSync.isReconnecting,
      connectedUsers: realtimeSync.connectedUsers,
      lastUpdate: realtimeSync.lastUpdate,
    },
  };
}
