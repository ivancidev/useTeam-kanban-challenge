import { Card } from "../types";

export const VIRTUALIZATION_CONFIG = {
  // Umbral para activar virtualización
  THRESHOLD: 6,

  // Altura base mínima para tarjetas
  BASE_CARD_SIZE: 75,

  // Margen base entre tarjetas (como en Trello)
  CARD_MARGIN: 12,

  // Número de elementos extra a renderizar arriba y abajo
  OVERSCAN: 5,

  // Altura máxima del contenedor virtualizado
  MAX_HEIGHT: 400,

  // Configuración de scroll
  SCROLL_CONFIG: {
    behavior: "smooth" as ScrollBehavior,
    block: "nearest" as ScrollLogicalPosition,
  },
} as const;

/**
 * Calcula la altura estimada de una tarjeta basada en su contenido
 * Similar a useCardDisplayLogic pero optimizado para virtualización
 */
export function calculateCardHeight(card: Card): number {
  let estimatedHeight = VIRTUALIZATION_CONFIG.BASE_CARD_SIZE; // altura base
  
  const hasDescription = card.description && card.description.trim().length > 0;
  const hasComments = card.comments && card.comments.trim().length > 0;
  const hasDueDate = card.dueDate && card.dueDate.trim().length > 0;
  const hasTags = card.tags && card.tags.length > 0;
  const showPriority = card.priority && card.priority !== "MEDIUM";
  const showType = card.type && card.type !== "TASK";

  // Agregar espacio para badges (tipo y prioridad)
  if (showType || showPriority) estimatedHeight += 22;
  
  // Agregar espacio para fecha límite
  if (hasDueDate) estimatedHeight += 24;
  
  // Agregar espacio para tags
  if (hasTags) estimatedHeight += 24;
  
  // Agregar espacio para indicadores de contenido adicional
  if (hasDescription || hasComments) estimatedHeight += 20;

  return Math.min(estimatedHeight, 150); // máximo 150px
}

/**
 * Calcula el margen dinámico basado en el contenido de la tarjeta
 * Tarjetas más grandes necesitan más espacio entre ellas
 */
export function calculateCardMargin(card: Card): number {
  const cardHeight = calculateCardHeight(card);
  
  // Margen base para tarjetas pequeñas
  if (cardHeight <= VIRTUALIZATION_CONFIG.BASE_CARD_SIZE) {
    return VIRTUALIZATION_CONFIG.CARD_MARGIN;
  }
  
  // Margen extra para tarjetas medianas (con algunos elementos)
  if (cardHeight <= 120) {
    return VIRTUALIZATION_CONFIG.CARD_MARGIN + 4; // 16px total
  }
  
  // Margen mayor para tarjetas grandes (con muchos elementos)
  return VIRTUALIZATION_CONFIG.CARD_MARGIN + 8; // 20px total
}

/**
 * Helper para calcular la altura del contenedor
 */
export function calculateContainerHeight(
  itemCount: number,
  totalSize: number,
  optimalCardSize?: number
): number {
  if (itemCount <= VIRTUALIZATION_CONFIG.THRESHOLD) {
    const cardSize =
      optimalCardSize ||
      VIRTUALIZATION_CONFIG.BASE_CARD_SIZE + VIRTUALIZATION_CONFIG.CARD_MARGIN;
    return Math.min(itemCount * cardSize, VIRTUALIZATION_CONFIG.MAX_HEIGHT);
  }

  return Math.min(totalSize + 50, VIRTUALIZATION_CONFIG.MAX_HEIGHT); // +50 para padding
}
