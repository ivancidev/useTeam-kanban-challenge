import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import type { Column } from "@/features/columns/types";
import type { Card } from "@/features/cards/types";

interface RealtimeState {
  socket: Socket | null;
  isConnected: boolean;
  connectedUsers: number;
  lastUpdate: Date | null;
  isReconnecting: boolean;
}

interface RealtimeActions {
  connect: () => void;
  disconnect: () => void;
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
  setupEventListeners: (callbacks: RealtimeCallbacks) => void;
  removeEventListeners: () => void;
}

interface RealtimeCallbacks {
  onColumnCreated: (column: Column) => void;
  onColumnUpdated: (column: Column) => void;
  onColumnDeleted: (columnId: string) => void;
  onCardCreated: (card: Card) => void;
  onCardUpdated: (card: Card) => void;
  onCardMoved: (cardData: {
    cardId: string;
    targetColumnId: string;
    newOrder: number;
  }) => void;
  onCardDeleted: (cardId: string) => void;
  onBoardUpdated: (data: { columns: Column[]; cards: Card[] }) => void;
}

type RealtimeStore = RealtimeState & RealtimeActions;

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  socket: null,
  isConnected: false,
  connectedUsers: 0,
  lastUpdate: null,
  isReconnecting: false,

  connect: () => {
    const { socket } = get();

    // Evitar múltiples conexiones
    if (socket?.connected) return;

    try {
      const newSocket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
        {
          transports: ["websocket"],
          autoConnect: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
          timeout: 20000,
        }
      );

      // Eventos de conexión
      newSocket.on("connect", () => {
        console.log("✅ WebSocket connected:", newSocket.id);
        set({
          socket: newSocket,
          isConnected: true,
          isReconnecting: false,
          lastUpdate: new Date(),
        });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("❌ WebSocket disconnected:", reason);
        set({
          isConnected: false,
          connectedUsers: 0,
          lastUpdate: new Date(),
        });
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log(
          "🔄 WebSocket reconnected after",
          attemptNumber,
          "attempts"
        );
        set({
          isConnected: true,
          isReconnecting: false,
          lastUpdate: new Date(),
        });
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log("🔄 Attempting to reconnect...", attemptNumber);
        set({ isReconnecting: true });
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("❌ Reconnection error:", error);
      });

      newSocket.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed after all attempts");
        set({ isReconnecting: false });
      });

      set({ socket: newSocket });
    } catch (error) {
      console.error("❌ Error connecting to WebSocket:", error);
    }
  },

  // Desconectar del servidor WebSocket
  disconnect: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        connectedUsers: 0,
        isReconnecting: false,
      });
    }
  },

  // Unirse a un tablero específico
  joinBoard: (boardId: string) => {
    const { socket } = get();

    if (socket?.connected) {
      socket.emit("join-board", boardId);
      console.log("📋 Joined board:", boardId);
    }
  },

  // Salir de un tablero específico
  leaveBoard: (boardId: string) => {
    const { socket } = get();

    if (socket?.connected) {
      socket.emit("leave-board", boardId);
      console.log("📋 Left board:", boardId);
    }
  },

  // Configurar listeners para eventos en tiempo real
  setupEventListeners: (callbacks: RealtimeCallbacks) => {
    const { socket } = get();

    if (!socket) return;

    // Remover listeners existentes para evitar duplicados
    get().removeEventListeners();

    // Eventos de columnas
    socket.on("column-created", (column: Column) => {
      console.log("🔥 Column created:", column);
      callbacks.onColumnCreated(column);
      set({ lastUpdate: new Date() });
    });

    socket.on("column-updated", (column: Column) => {
      console.log("🔥 Column updated:", column);
      callbacks.onColumnUpdated(column);
      set({ lastUpdate: new Date() });
    });

    socket.on("column-deleted", ({ columnId }: { columnId: string }) => {
      console.log("🔥 Column deleted:", columnId);
      callbacks.onColumnDeleted(columnId);
      set({ lastUpdate: new Date() });
    });

    // Eventos de tarjetas
    socket.on("card-created", (card: Card) => {
      console.log("🔥 Card created:", card);
      callbacks.onCardCreated(card);
      set({ lastUpdate: new Date() });
    });

    socket.on("card-updated", (card: Card) => {
      console.log("🔥 Card updated:", card);
      callbacks.onCardUpdated(card);
      set({ lastUpdate: new Date() });
    });

    socket.on(
      "card-moved",
      (cardData: {
        cardId: string;
        targetColumnId: string;
        newOrder: number;
      }) => {
        console.log("🔥 Card moved:", cardData);
        callbacks.onCardMoved(cardData);
        set({ lastUpdate: new Date() });
      }
    );

    socket.on("card-deleted", ({ cardId }: { cardId: string }) => {
      console.log("🔥 Card deleted:", cardId);
      callbacks.onCardDeleted(cardId);
      set({ lastUpdate: new Date() });
    });

    // Eventos del tablero
    socket.on("board-updated", (data: { columns: Column[]; cards: Card[] }) => {
      callbacks.onBoardUpdated(data);
      set({ lastUpdate: new Date() });
    });
  },

  removeEventListeners: () => {
    const { socket } = get();

    if (!socket) return;

    const events = [
      "column-created",
      "column-updated",
      "column-deleted",
      "card-created",
      "card-updated",
      "card-moved",
      "card-deleted",
      "board-updated",
    ];

    events.forEach((event) => {
      socket.off(event);
    });
  },
}));
