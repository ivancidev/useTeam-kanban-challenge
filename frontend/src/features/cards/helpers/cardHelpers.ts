import { CardPriority, CardType } from "../types";

export const CARD_PRIORITY_OPTIONS = [
  {
    value: CardPriority.LOW,
    label: "Baja",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "⬇️",
    badgeColor: "bg-gray-500",
  },
  {
    value: CardPriority.MEDIUM,
    label: "Media",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "➡️",
    badgeColor: "bg-blue-500",
  },
  {
    value: CardPriority.HIGH,
    label: "Alta",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "⬆️",
    badgeColor: "bg-orange-500",
  },
  {
    value: CardPriority.URGENT,
    label: "Urgente",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🚨",
    badgeColor: "bg-red-500",
  },
];

export const CARD_TYPE_OPTIONS = [
  {
    value: CardType.TASK,
    label: "Tarea",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
    badgeColor: "bg-green-500",
  },
  {
    value: CardType.BUG,
    label: "Bug",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "🐛",
    badgeColor: "bg-red-500",
  },
  {
    value: CardType.ENHANCEMENT,
    label: "Mejora",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "⭐",
    badgeColor: "bg-purple-500",
  },
  {
    value: CardType.FEATURE,
    label: "Funcionalidad",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🚀",
    badgeColor: "bg-blue-500",
  },
  {
    value: CardType.DOCUMENTATION,
    label: "Documentación",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "📝",
    badgeColor: "bg-yellow-500",
  },
  {
    value: CardType.RESEARCH,
    label: "Investigación",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    icon: "🔍",
    badgeColor: "bg-indigo-500",
  },
];

export const PREDEFINED_TAGS = [
  "Frontend",
  "Backend",
  "Database",
  "UI/UX",
  "Testing",
  "Security",
  "Performance",
  "API",
  "Mobile",
  "Desktop",
  "DevOps",
  "Analytics",
];

/**
 * Valida si un título de tarjeta es válido
 */
export function isValidCardTitle(title: string): boolean {
  return title.trim().length > 0;
}

/**
 * Limpia y formatea los datos de una tarjeta para guardar
 */
export function sanitizeCardData(
  title: string,
  description: string,
  comments?: string,
  tags?: string[]
) {
  return {
    title: title.trim(),
    description: description.trim(),
    comments: comments?.trim(),
    tags: tags || [],
  };
}

/**
 * Formatea la fecha para mostrar en la UI
 */
export function formatCardDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES");
}

/**
 * Valida si un comentario es válido
 */
export function isValidComment(comment: string): boolean {
  return comment.trim().length > 0;
}

/**
 * Valida los datos del formulario de tarjeta
 */
export function validateCardForm(title: string): { title?: string } {
  const errors: { title?: string } = {};

  if (!isValidCardTitle(title)) {
    errors.title = "El título es requerido";
  }

  return errors;
}

/**
 * Prepara los datos de la tarjeta para envío
 */
export function prepareCardDataForSubmission(
  title: string,
  description: string
): { title: string; description?: string } {
  const sanitized = sanitizeCardData(title, description);
  return {
    title: sanitized.title,
    description: sanitized.description || undefined,
  };
}
