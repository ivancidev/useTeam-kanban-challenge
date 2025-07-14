"use client";

import { useMemo, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Column } from "../types";
import { COLUMN_VIRTUALIZATION_CONFIG } from "../helpers/columnVirtualizationHelpers";

interface UseVirtualizedColumnsProps {
  columns: Column[];
  enabled?: boolean;
}

export function useVirtualizedColumns({
  columns,
  enabled = true,
}: UseVirtualizedColumnsProps) {
  const scrollElementRef = useRef<HTMLElement | null>(null);

  const virtualizer = useVirtualizer({
    count: columns.length,
    horizontal: true,
    getScrollElement: () => {
      const element =
        scrollElementRef.current ||
        (document.querySelector(".kanban-horizontal-scroll") as HTMLElement);
      if (!element) {
        return null;
      }
      return element;
    },
    estimateSize: () => {
      const size =
        COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
        COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN;
      return size;
    },
    // Aumentar overscan para mostrar más columnas
    overscan: Math.max(5, Math.ceil(columns.length * 0.5)), // Al menos 50% de las columnas
    enabled: enabled && columns.length > 0,
    // Dimensiones más grandes para forzar que se vean más elementos
    initialRect: { width: 5000, height: 500 },
    scrollPaddingStart: 0,
    scrollPaddingEnd: 0,
    // Forzar que renderice un rango más amplio
    rangeExtractor: (range) => {
      const start = Math.max(range.startIndex - 3, 0);
      const end = Math.min(range.endIndex + 3, columns.length - 1);

      const items = [];
      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      // Si no estamos viendo suficientes elementos, forzar mostrar más
      if (items.length < Math.min(7, columns.length)) {
        const additionalItems = Math.min(7, columns.length) - items.length;
        for (let i = 0; i < additionalItems && i < columns.length; i++) {
          if (!items.includes(i)) {
            items.push(i);
          }
        }
      }

      return items.sort((a, b) => a - b);
    },
  });

  // Asegurar que el elemento scroll esté disponible y forzar medición
  useEffect(() => {
    const timer = setTimeout(() => {
      const element = document.querySelector(
        ".kanban-horizontal-scroll"
      ) as HTMLElement;
      scrollElementRef.current = element;

      // Forzar medición inicial cuando cambien las columnas
      if (element && columns.length > 0) {
        virtualizer.measure();
        // Forzar una segunda medición para asegurar actualización
        setTimeout(() => {
          virtualizer.measure();
        }, 50);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [columns.length, virtualizer]);

  // Efecto adicional para manejar cambios dinámicos en columnas
  useEffect(() => {
    if (enabled && columns.length > 0) {
      // Pequeño delay para permitir que el DOM se actualice
      const timer = setTimeout(() => {
        virtualizer.measure();
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [columns, enabled, virtualizer]);

  const { getVirtualItems, getTotalSize } = virtualizer;

  const virtualItems = useMemo(() => {
    if (!enabled) return [];

    const items = getVirtualItems();

    // Si no hay items virtuales pero sí columnas, crear fallback más inteligente
    if (items.length === 0 && columns.length > 0) {
      console.log("🚨 Creando fallback para todas las columnas");

      // Crear items para TODAS las columnas, no solo las primeras
      return Array.from({ length: columns.length }, (_, index) => ({
        index,
        start:
          index *
          (COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
            COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN),
        size: COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE,
        end:
          (index + 1) *
          (COLUMN_VIRTUALIZATION_CONFIG.FIXED_COLUMN_SIZE +
            COLUMN_VIRTUALIZATION_CONFIG.COLUMN_MARGIN),
        key: `column-fallback-${index}`,
      }));
    }

    // Si tenemos items pero son muy pocos comparado con las columnas totales, expandir
    if (items.length > 0 && items.length < columns.length * 0.7) {
      // Forzar medición adicional en casos raros
      setTimeout(() => {
        virtualizer.measure();
      }, 100);
    }

    return items;
  }, [getVirtualItems, columns.length, virtualizer, enabled]);

  const totalSize = useMemo(() => {
    return getTotalSize();
  }, [getTotalSize]);

  return {
    virtualItems,
    totalSize,
    virtualizer,
  };
}
