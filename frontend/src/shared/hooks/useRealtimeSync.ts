import { useEffect, useCallback } from "react";
import { useRealtimeStore } from "@/shared/stores/realtimeStore";
import { useNotifications } from "@/shared/hooks/useNotifications";
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

  // Conectar y configurar listeners al montar
  useEffect(() => {
    // Conectar al WebSocket
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
          notifyInfo(`Nueva columna creada: ${column.name}`);
        },

        onColumnUpdated: (column: Column) => {
          onColumnUpdated(column);
          notifyInfo(`Columna actualizada: ${column.name}`);
        },

        onColumnDeleted: (columnId: string) => {
          onColumnDeleted(columnId);
          notifyInfo("Columna eliminada");
        },

        onCardCreated: (card: Card) => {
          onCardCreated(card);
          notifySuccess(`Nueva tarjeta: ${card.title}`);
        },

        onCardUpdated: (card: Card) => {
          onCardUpdated(card);
          notifyInfo(`Tarjeta actualizada: ${card.title}`);
        },

        onCardMoved: (cardData) => {
          onCardMoved(cardData);
          notifyInfo("Tarjeta movida");
        },

        onCardDeleted: (cardId: string) => {
          onCardDeleted(cardId);
          notifyInfo("Tarjeta eliminada");
        },

        onBoardUpdated: (data) => {
          onBoardUpdated?.(data);
          notifyInfo("Tablero actualizado");
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
  ]);

  // Limpiar listeners cuando cambie el boardId
  useEffect(() => {
    return () => {
      if (boardId) {
        leaveBoard(boardId);
      }
    };
  }, [boardId, leaveBoard]);

  // Función para indicar que el usuario está realizando una acción
  const markUserAction = useCallback(() => {
    // Esto puede ser útil para evitar notificaciones de las propias acciones
    // Por ahora solo registramos la acción
    console.log("👤 User action performed");
  }, []);

  return {
    isConnected,
    isReconnecting,
    connectedUsers,
    lastUpdate,
    markUserAction,
    // Funciones de control manual (opcional)
    manualConnect: connect,
    manualDisconnect: disconnect,
  };
};
