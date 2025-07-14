import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useRef, useMemo } from "react";
import { Card } from "../types";
import {
  VIRTUALIZATION_CONFIG,
  calculateCardHeight,
  calculateCardMargin,
} from "../helpers/virtualizationHelpers";

interface UseVirtualizedCardsConfig {
  cards: Card[];
  enabled?: boolean;
  overscan?: number;
  threshold?: number;
}

interface UseVirtualizedCardsReturn {
  parentRef: React.RefObject<HTMLDivElement | null>;
  virtualItems: VirtualItem[];
  totalSize: number;
  shouldVirtualize: boolean;
  optimalCardSize: number;
}

export function useVirtualizedCards({
  cards,
  enabled = true,
  overscan = 5,
  threshold = 30,
}: UseVirtualizedCardsConfig): UseVirtualizedCardsReturn {
  const parentRef = useRef<HTMLDivElement>(null);

  const shouldVirtualize = useMemo(
    () => enabled && cards.length > threshold,
    [enabled, cards.length, threshold]
  );

  // Calcular alturas dinámicas para cada tarjeta
  const cardHeights = useMemo(() => {
    return cards.map(
      (card) => calculateCardHeight(card) + calculateCardMargin(card)
    );
  }, [cards]);

  const virtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      // Usar altura dinámica para cada tarjeta
      return (
        cardHeights[index] ||
        VIRTUALIZATION_CONFIG.BASE_CARD_SIZE + VIRTUALIZATION_CONFIG.CARD_MARGIN
      );
    },
    overscan,
    enabled: shouldVirtualize,
  });

  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];
  const totalSize = shouldVirtualize ? virtualizer.getTotalSize() : 0;

  // Calcular tamaño promedio para compatibilidad
  const averageCardSize = useMemo(() => {
    if (cardHeights.length === 0)
      return (
        VIRTUALIZATION_CONFIG.BASE_CARD_SIZE + VIRTUALIZATION_CONFIG.CARD_MARGIN
      );
    return (
      cardHeights.reduce((sum, height) => sum + height, 0) / cardHeights.length
    );
  }, [cardHeights]);

  return {
    parentRef,
    virtualItems,
    totalSize,
    shouldVirtualize,
    optimalCardSize: averageCardSize,
  };
}
