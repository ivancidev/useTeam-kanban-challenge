import { useCallback, useEffect, useState } from "react";
import { Column } from "../../columns/types";

interface UseKanbanScrollLogicProps {
  columns: Column[];
}

export function useKanbanScrollLogic({ columns }: UseKanbanScrollLogicProps) {
  // Estado para controlar la visibilidad de los botones de scroll
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Función para actualizar el estado de los botones de scroll
  const updateScrollButtons = useCallback(
    (scrollContainer: HTMLElement) => {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;

      // Calcular cuántas columnas caben en la pantalla
      const columnWidth = 320; // w-80 = 320px
      const gap = 24; // gap-6 = 24px
      const containerPadding = 32; // px-4 = 16px cada lado
      const availableWidth = clientWidth - containerPadding;
      const columnsPlusGap = columnWidth + gap;
      const columnsVisible = Math.floor(availableWidth / columnsPlusGap);

      // Solo mostrar botones si hay más columnas de las que caben en pantalla
      const hasHorizontalOverflow = columns.length > columnsVisible;

      // Más precisión en la detección de scroll
      const canScrollLeftNow = scrollLeft > 5 && hasHorizontalOverflow;

      // Controlar que no vaya más allá del contenido real
      // Usar directamente scrollWidth que es el contenido real renderizado
      const realMaxScrollLeft = Math.max(0, scrollWidth - clientWidth);
      const canScrollRightNow =
        scrollLeft < realMaxScrollLeft - 5 &&
        hasHorizontalOverflow &&
        realMaxScrollLeft > 0;

      setCanScrollLeft(canScrollLeftNow);
      setCanScrollRight(canScrollRightNow);
    },
    [columns.length]
  );

  // Efecto para inicializar el estado de los botones cuando las columnas cambian
  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".kanban-horizontal-scroll"
    ) as HTMLElement;
    if (scrollContainer && columns.length > 0) {
      setTimeout(() => {
        updateScrollButtons(scrollContainer);
      }, 100);
    } else {
      // Si no hay columnas, ocultar todos los botones
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  }, [columns.length, updateScrollButtons]);

  // Efecto para recalcular cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const scrollContainer = document.querySelector(
        ".kanban-horizontal-scroll"
      ) as HTMLElement;
      if (scrollContainer && columns.length > 0) {
        setTimeout(() => {
          updateScrollButtons(scrollContainer);
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns.length, updateScrollButtons]);

  // Función para scroll suave hacia la derecha
  const scrollToNext = () => {
    const scrollContainer = document.querySelector(
      ".kanban-horizontal-scroll"
    ) as HTMLElement;
    if (scrollContainer) {
      const columnWidth = 320;
      const gap = 24;
      const scrollAmount = columnWidth + gap;

      // Usar scrollWidth que es el ancho real del contenido renderizado
      const realMaxScrollLeft = Math.max(
        0,
        scrollContainer.scrollWidth - scrollContainer.clientWidth
      );

      // Solo hacer scroll si no estamos ya en el límite
      if (
        realMaxScrollLeft > 0 &&
        scrollContainer.scrollLeft < realMaxScrollLeft - 5
      ) {
        const newScrollLeft = Math.min(
          scrollContainer.scrollLeft + scrollAmount,
          realMaxScrollLeft
        );

        scrollContainer.scrollTo({
          left: newScrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  // Función para scroll suave hacia la izquierda
  const scrollToPrev = () => {
    const scrollContainer = document.querySelector(
      ".kanban-horizontal-scroll"
    ) as HTMLElement;
    if (scrollContainer && scrollContainer.scrollLeft > 5) {
      const columnWidth = 320;
      const gap = 24;
      const scrollAmount = columnWidth + gap;

      const newScrollLeft = Math.max(
        0,
        scrollContainer.scrollLeft - scrollAmount
      );

      scrollContainer.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return {
    canScrollLeft,
    canScrollRight,
    updateScrollButtons,
    scrollToNext,
    scrollToPrev,
  };
}
