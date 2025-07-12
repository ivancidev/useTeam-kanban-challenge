// Hook específico para manejo de eventos de tiempo real del tablero
import { useCallback } from "react";
import type { Column } from "../types";
import type { Card } from "../../cards/types";

export const useBoardRealtimeHandlers = (
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>
) => {
  // Handlers para columnas en tiempo real
  const handleRealtimeColumnCreated = useCallback(
    (column: Column) => {
      setColumns((prev) => {
        // Evitar duplicados
        if (prev.find((col) => col.id === column.id)) return prev;
        return [...prev, column];
      });
    },
    [setColumns]
  );

  const handleRealtimeColumnUpdated = useCallback(
    (column: Column) => {
      setColumns((prev) =>
        prev.map((col) => (col.id === column.id ? column : col))
      );
    },
    [setColumns]
  );

  const handleRealtimeColumnDeleted = useCallback(
    (columnId: string) => {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    },
    [setColumns]
  );

  // Handlers para tarjetas en tiempo real
  const handleRealtimeCardCreated = useCallback(
    (card: Card) => {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === card.columnId) {
            const existingCard = col.cards?.find((c) => c.id === card.id);
            if (existingCard) return col; // Evitar duplicados

            return {
              ...col,
              cards: [...(col.cards || []), card],
            };
          }
          return col;
        })
      );
    },
    [setColumns]
  );

  const handleRealtimeCardUpdated = useCallback(
    (card: Card) => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards?.map((c) => (c.id === card.id ? card : c)) || [],
        }))
      );
    },
    [setColumns]
  );

  const handleRealtimeCardMoved = useCallback(
    (cardData: {
      cardId: string;
      targetColumnId: string;
      newOrder: number;
    }) => {
      setColumns((prev) => {
        const newColumns = [...prev];
        let movedCard: Card | null = null;

        // Encontrar y remover la tarjeta de su columna actual
        newColumns.forEach((col) => {
          if (col.cards) {
            const cardIndex = col.cards.findIndex(
              (c) => c.id === cardData.cardId
            );
            if (cardIndex !== -1) {
              movedCard = {
                ...col.cards[cardIndex],
                columnId: cardData.targetColumnId,
                order: cardData.newOrder,
              };
              col.cards = col.cards.filter((c) => c.id !== cardData.cardId);
            }
          }
        });

        // Añadir la tarjeta a la nueva columna
        if (movedCard) {
          newColumns.forEach((col) => {
            if (col.id === cardData.targetColumnId) {
              col.cards = [...(col.cards || []), movedCard!].sort(
                (a, b) => a.order - b.order
              );
            }
          });
        }

        return newColumns;
      });
    },
    [setColumns]
  );

  const handleRealtimeCardDeleted = useCallback(
    (cardId: string) => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          cards: col.cards?.filter((c) => c.id !== cardId) || [],
        }))
      );
    },
    [setColumns]
  );

  return {
    // Handlers de columnas
    handleRealtimeColumnCreated,
    handleRealtimeColumnUpdated,
    handleRealtimeColumnDeleted,
    // Handlers de tarjetas
    handleRealtimeCardCreated,
    handleRealtimeCardUpdated,
    handleRealtimeCardMoved,
    handleRealtimeCardDeleted,
  };
};
