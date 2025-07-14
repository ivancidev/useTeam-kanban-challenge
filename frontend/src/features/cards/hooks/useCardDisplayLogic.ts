"use client";

import { useMemo } from "react";
import { Card } from "../types";

export function useCardDisplayLogic(card: Card) {
  const cardInfo = useMemo(() => {
    const hasDescription =
      card.description && card.description.trim().length > 0;
    const hasComments = card.comments && card.comments.trim().length > 0;
    const hasDueDate = card.dueDate && card.dueDate.trim().length > 0;
    const hasTags = card.tags && card.tags.length > 0;

    // Determinar la altura de la tarjeta basada en el contenido
    let estimatedHeight = 75; // altura base

    if (hasDescription || hasComments) estimatedHeight += 20;
    if (hasDueDate) estimatedHeight += 25;
    if (hasTags) estimatedHeight += 25;

    const showPriority = card.priority && card.priority !== "MEDIUM";
    const showType = card.type && card.type !== "TASK";

    return {
      hasDescription,
      hasComments,
      hasDueDate,
      hasTags,
      showPriority,
      showType,
      estimatedHeight: Math.min(estimatedHeight, 140), // máximo 140px
    };
  }, [card]);

  return cardInfo;
}
