export const VIRTUALIZATION_CONFIG = {
  // Umbral para activar virtualización
  THRESHOLD: 6,

  // Altura fija para TODAS las tarjetas (sin variables)
  FIXED_CARD_SIZE: 75,

  // Margen uniforme entre tarjetas (reducido para mejor fit)
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
      VIRTUALIZATION_CONFIG.FIXED_CARD_SIZE + VIRTUALIZATION_CONFIG.CARD_MARGIN;
    return Math.min(itemCount * cardSize, VIRTUALIZATION_CONFIG.MAX_HEIGHT);
  }

  return Math.min(totalSize + 50, VIRTUALIZATION_CONFIG.MAX_HEIGHT); // +50 para padding
}
