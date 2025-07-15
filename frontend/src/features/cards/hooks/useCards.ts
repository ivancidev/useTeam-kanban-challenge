"use client";

import { useState } from "react";
import { cardsApi } from "../services/api";

import { useNotifications } from "../../../shared/hooks/useNotifications";
import { userActionTracker } from "../../../shared/utils/userActionTracker";

import type { Card, CreateCardDto, UpdateCardDto, MoveCardDto } from "../types";

export function useCards() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotifications();

  const createCard = async (data: CreateCardDto): Promise<Card | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const newCard = await cardsApi.createCard(data);

      // Marcar la acción del usuario para evitar notificaciones duplicadas
      if (newCard) {
        userActionTracker.markAction("card-created", newCard.id);
      }

      notifySuccess("Tarjeta creada exitosamente");
      return newCard;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create card";
      setError(errorMessage);
      notifyError("Error al crear la tarjeta");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (
    id: string,
    data: UpdateCardDto
  ): Promise<Card | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Marcar la acción del usuario antes de la actualización
      userActionTracker.markAction("card-updated", id);

      const updatedCard = await cardsApi.updateCard(id, data);
      notifySuccess("Tarjeta actualizada exitosamente");
      return updatedCard;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update card";
      setError(errorMessage);
      notifyError("Error al actualizar la tarjeta");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const moveCard = async (
    id: string,
    data: MoveCardDto
  ): Promise<Card | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Marcar la acción del usuario antes del movimiento
      userActionTracker.markAction("card-moved", id);

      const movedCard = await cardsApi.moveCard(id, data);
      notifySuccess("Tarjeta movida exitosamente");
      return movedCard;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to move card";
      setError(errorMessage);
      notifyError("Error al mover la tarjeta");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Marcar la acción del usuario antes de la eliminación
      userActionTracker.markAction("card-deleted", id);

      await cardsApi.deleteCard(id);
      notifySuccess("Tarjeta eliminada exitosamente");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete card";
      setError(errorMessage);
      notifyError("Error al eliminar la tarjeta");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    clearError,
  };
}
