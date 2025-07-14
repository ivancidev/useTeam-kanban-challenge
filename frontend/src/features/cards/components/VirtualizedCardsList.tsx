"use client";

import { memo } from "react";
import { VirtualItem } from "@tanstack/react-virtual";
import { Card } from "../types";
import { CardItem } from "./CardItem";
import { useVirtualizedCards } from "../hooks/useVirtualizedCards";
import {
  VIRTUALIZATION_CONFIG,
  calculateContainerHeight,
  calculateCardMargin,
} from "../helpers/virtualizationHelpers";

interface VirtualizedCardsListProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (cardId: string) => void;
  isLoading: boolean;
  onClick?: (card: Card) => void;
}

export const VirtualizedCardsList = memo(function VirtualizedCardsList({
  cards,
  onEdit,
  onDelete,
  isLoading,
  onClick,
}: VirtualizedCardsListProps) {
  const { parentRef, virtualItems, totalSize, optimalCardSize } =
    useVirtualizedCards({
      cards,
      enabled: true,
      overscan: VIRTUALIZATION_CONFIG.OVERSCAN,
      threshold: 0, // Siempre virtualizar - más óptimo
    });

  const containerHeight = calculateContainerHeight(
    cards.length,
    totalSize,
    optimalCardSize
  );

  // Solo mostrar scroll cuando realmente se necesite
  const needsScroll = totalSize > VIRTUALIZATION_CONFIG.MAX_HEIGHT;
  const scrollClass = needsScroll ? "overflow-y-auto" : "overflow-y-hidden";

  // Siempre usar renderizado virtualizado (más óptimo)
  return (
    <div
      ref={parentRef}
      className={`${scrollClass} overflow-x-visible pt-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
      style={{
        height: `${containerHeight}px`,
        width: "100%",
      }}
    >
      <div
        style={{
          height: `${totalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem: VirtualItem) => {
          const card = cards[virtualItem.index];
          if (!card) return null;

          // Calcular margen dinámico para esta tarjeta específica
          const dynamicMargin = calculateCardMargin(card);

          return (
            <div
              key={card.id}
              data-index={virtualItem.index}
              className="absolute top-0 left-0 w-full isolate"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
                height: `${virtualItem.size}px`,
              }}
            >
              <div
                className="relative w-full h-full"
                style={{
                  paddingBottom: `${dynamicMargin}px`, // Margen dinámico basado en contenido
                }}
              >
                <CardItem
                  card={card}
                  onClick={onClick}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isLoading={isLoading}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
