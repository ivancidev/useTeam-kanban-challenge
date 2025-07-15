import { useEffect, useCallback } from "react";

import { useRealtimeStore } from "@/shared/stores/realtimeStore";
import { useNotifications } from "@/shared/hooks/useNotifications";
import { userActionTracker } from "@/shared/utils/userActionTracker";

import type { Column } from "@/features/columns/types";
import type { Card } from "@/features/cards/types";
import { UseRealtimeSyncProps } from "../types";


export const useRealtimeSync = ({
  boardId,
  onColumnCreated,
  onColumnUpdated,
  onColumnDeleted,
  onCardCreated,
  onCardUpdated,
  onCardMoved,
  onCardDeleted,
  onBoardUpdated,
}: UseRealtimeSyncProps) => {
  const {
    connect,
    disconnect,
    joinBoard,
    leaveBoard,
    setupEventListeners,
    removeEventListeners,
    isConnected,
    isReconnecting,
    connectedUsers,
    lastUpdate,
  } = useRealtimeStore();

  const { notifyInfo, notifySuccess } = useNotifications();

  // Función para marcar la acción del usuario usando el rastreador global
  const markUserAction = useCallback((actionType: string, entityId: string) => {
    userActionTracker.markAction(actionType, entityId);
  }, []);

  // Función para verificar si se trata de una acción propia del usuario utilizando el rastreador global
  const isUserOwnAction = useCallback(
    (actionType: string, entityId: string) => {
      return userActionTracker.isUserAction(actionType, entityId);
    },
    []
  );

  useEffect(() => {
    connect();

    return () => {
      removeEventListeners();
      leaveBoard(boardId);
    };
  }, [connect, removeEventListeners, leaveBoard, boardId]);

  // Unirse al tablero cuando esté conectado
  useEffect(() => {
    if (isConnected && boardId) {
      joinBoard(boardId);

      // Configurar listeners para eventos en tiempo real
      setupEventListeners({
        onColumnCreated: (column: Column) => {
          onColumnCreated(column);
          // Solo mostrar notificación si NO es una acción propia
          if (!isUserOwnAction("column-created", column.id)) {
            notifyInfo(`Nueva columna creada: ${column.name}`);
          }
        },

        onColumnUpdated: (column: Column) => {
          onColumnUpdated(column);
          if (!isUserOwnAction("column-updated", column.id)) {
            notifyInfo(`Columna actualizada: ${column.name}`);
          }
        },

        onColumnDeleted: (columnId: string) => {
          onColumnDeleted(columnId);
          if (!isUserOwnAction("column-deleted", columnId)) {
            notifyInfo("Columna eliminada");
          }
        },

        onCardCreated: (card: Card) => {
          onCardCreated(card);
          if (!isUserOwnAction("card-created", card.id)) {
            notifySuccess(`Nueva tarjeta: ${card.title}`);
          }
        },

        onCardUpdated: (card: Card) => {
          onCardUpdated(card);
          if (!isUserOwnAction("card-updated", card.id)) {
            notifyInfo(`Tarjeta actualizada: ${card.title}`);
          }
        },

        onCardMoved: (cardData) => {
          onCardMoved(cardData);
          if (!isUserOwnAction("card-moved", cardData.cardId)) {
            notifyInfo("Tarjeta movida");
          }
        },

        onCardDeleted: (cardId: string) => {
          onCardDeleted(cardId);
          if (!isUserOwnAction("card-deleted", cardId)) {
            notifyInfo("Tarjeta eliminada");
          }
        },

        onBoardUpdated: (data) => {
          onBoardUpdated?.(data);
          if (!isUserOwnAction("board-updated", boardId)) {
            notifyInfo("Tablero actualizado");
          }
        },
      });
    }
  }, [
    isConnected,
    boardId,
    joinBoard,
    setupEventListeners,
    onColumnCreated,
    onColumnUpdated,
    onColumnDeleted,
    onCardCreated,
    onCardUpdated,
    onCardMoved,
    onCardDeleted,
    onBoardUpdated,
    notifyInfo,
    notifySuccess,
    isUserOwnAction,
  ]);

  // Limpiar listeners cuando cambie el boardId
  useEffect(() => {
    return () => {
      if (boardId) {
        leaveBoard(boardId);
      }
    };
  }, [boardId, leaveBoard]);

  return {
    isConnected,
    isReconnecting,
    connectedUsers,
    lastUpdate,
    markUserAction,
    manualConnect: connect,
    manualDisconnect: disconnect,
  };
};
