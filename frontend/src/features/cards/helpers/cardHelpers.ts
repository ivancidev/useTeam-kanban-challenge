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
 * Formatea la fecha límite para mostrar en las tarjetas
 */
export function formatCardDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays === -1) return "Ayer";
  if (diffDays > 0 && diffDays <= 7) return `En ${diffDays} días`;
  if (diffDays < 0 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Verifica si una tarjeta está vencida
 */
export function isCardOverdue(dueDate: string): boolean {
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
}