import { useVirtualizer, VirtualItem } from "@tanstack/react-virtual";
import { useRef, useMemo } from "react";
import { Card } from "../types";
import { VIRTUALIZATION_CONFIG } from "../helpers/virtualizationHelpers";

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

  const virtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => {
      // Tamaño FIJO para todas las tarjetas (75px tarjeta + 16px margen)
      return (
        VIRTUALIZATION_CONFIG.FIXED_CARD_SIZE +
        VIRTUALIZATION_CONFIG.CARD_MARGIN
      );
    },
    overscan,
    enabled: shouldVirtualize,
  });

  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];
  const totalSize = shouldVirtualize ? virtualizer.getTotalSize() : 0;

  return {
    parentRef,
    virtualItems,
    totalSize,
    shouldVirtualize,
    optimalCardSize:
      VIRTUALIZATION_CONFIG.FIXED_CARD_SIZE + VIRTUALIZATION_CONFIG.CARD_MARGIN,
  };
}
