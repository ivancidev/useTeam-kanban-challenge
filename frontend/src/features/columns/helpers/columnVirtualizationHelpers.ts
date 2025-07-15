export const COLUMN_VIRTUALIZATION_CONFIG = {
  // Umbral para activar virtualización (reducido para ser más dinámico)
  THRESHOLD: 5,

  // Ancho fijo para TODAS las columnas (sin variables)
  FIXED_COLUMN_SIZE: 320, // w-80

  // Margen uniforme entre columnas
  COLUMN_MARGIN: 24, // gap-6

  // Número de elementos extra a renderizar a los lados
  OVERSCAN: 3,

  // Ancho máximo del contenedor virtualizado (dinámico)
  MAX_WIDTH: 10000, // Muy alto para permitir cualquier cantidad

  // Configuración de scroll
  SCROLL_CONFIG: {
    behavior: "smooth" as ScrollBehavior,
    block: "nearest" as ScrollLogicalPosition,
  },
} as const;
