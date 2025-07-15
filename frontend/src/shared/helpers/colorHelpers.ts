export const columnColors = {
  blue: {
    light: "bg-blue-50 border-blue-200",
    medium: "bg-blue-100 border-blue-300",
    dark: "bg-blue-200 border-blue-400",
    text: "text-blue-800",
    header: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    shadow: "shadow-blue-100",
  },
  green: {
    light: "bg-emerald-50 border-emerald-200",
    medium: "bg-emerald-100 border-emerald-300",
    dark: "bg-emerald-200 border-emerald-400",
    text: "text-emerald-800",
    header: "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white",
    shadow: "shadow-emerald-100",
  },
  purple: {
    light: "bg-purple-50 border-purple-200",
    medium: "bg-purple-100 border-purple-300",
    dark: "bg-purple-200 border-purple-400",
    text: "text-purple-800",
    header: "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
    shadow: "shadow-purple-100",
  },
  orange: {
    light: "bg-orange-50 border-orange-200",
    medium: "bg-orange-100 border-orange-300",
    dark: "bg-orange-200 border-orange-400",
    text: "text-orange-800",
    header: "bg-gradient-to-r from-orange-400 to-orange-600 text-white",
    shadow: "shadow-orange-100",
  },
  pink: {
    light: "bg-pink-50 border-pink-200",
    medium: "bg-pink-100 border-pink-300",
    dark: "bg-pink-200 border-pink-400",
    text: "text-pink-800",
    header: "bg-gradient-to-r from-pink-400 to-pink-600 text-white",
    shadow: "shadow-pink-100",
  },
  indigo: {
    light: "bg-indigo-50 border-indigo-200",
    medium: "bg-indigo-100 border-indigo-300",
    dark: "bg-indigo-200 border-indigo-400",
    text: "text-indigo-800",
    header: "bg-gradient-to-r from-indigo-400 to-indigo-600 text-white",
    shadow: "shadow-indigo-100",
  },
} as const;

export const buttonColors = {
  primary: {
    base: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    hover: "hover:from-blue-600 hover:to-blue-700",
    active: "active:from-blue-700 active:to-blue-800",
    disabled: "disabled:from-gray-300 disabled:to-gray-400",
  },
  secondary: {
    base: "bg-gray-100 text-gray-700 border border-gray-300",
    hover: "hover:bg-gray-200 hover:border-gray-400",
    active: "active:bg-gray-300",
  },
  success: {
    base: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    hover: "hover:from-green-600 hover:to-green-700",
    active: "active:from-green-700 active:to-green-800",
  },
  danger: {
    base: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    hover: "hover:from-red-600 hover:to-red-700",
    active: "active:from-red-700 active:to-red-800",
  },
  ghost: {
    base: "bg-transparent text-gray-600 border border-transparent",
    hover: "hover:bg-gray-100 hover:text-gray-800",
    active: "active:bg-gray-200",
  },
} as const;

// Función para obtener color de columna estable basado en ID
export const getColumnColorById = (columnId: string) => {
  const colorKeys = Object.keys(columnColors) as Array<
    keyof typeof columnColors
  >;

  // Crear un hash simple del ID para obtener un índice consistente
  let hash = 0;
  for (let i = 0; i < columnId.length; i++) {
    const char = columnId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir a 32-bit integer
  }

  // Usar el valor absoluto del hash para obtener un índice positivo
  const index = Math.abs(hash) % colorKeys.length;
  const colorKey = colorKeys[index];
  return columnColors[colorKey];
};

// Función para obtener clases de botón completas
export const getButtonClasses = (
  variant: keyof typeof buttonColors = "primary",
  size: "sm" | "md" | "lg" = "md",
  fullWidth: boolean = false
) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const widthClass = fullWidth ? "w-full" : "";

  const colorClasses = buttonColors[variant];

  return `${baseClasses} ${sizeClasses[size]} ${widthClass} ${colorClasses.base} ${colorClasses.hover} ${colorClasses.active}`.trim();
};

// Gradientes de fondo para la aplicación
export const backgroundGradients = {
  main: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
  card: "bg-gradient-to-br from-white to-gray-50",
  header: "bg-gradient-to-r from-slate-800 to-slate-900",
} as const;

// Paleta de colores creativos para tarjetas
export const cardColorPalettes = [
  {
    background: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    border: "ring-blue-200/60 hover:ring-blue-300/80",
    shadow: "shadow-blue-200/40 hover:shadow-blue-300/60",
    accent:
      "before:from-blue-400/20 before:via-indigo-400/20 before:to-purple-400/20",
  },
  {
    background: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
    border: "ring-emerald-200/60 hover:ring-emerald-300/80",
    shadow: "shadow-emerald-200/40 hover:shadow-emerald-300/60",
    accent:
      "before:from-emerald-400/20 before:via-teal-400/20 before:to-cyan-400/20",
  },
  {
    background: "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50",
    border: "ring-pink-200/60 hover:ring-pink-300/80",
    shadow: "shadow-pink-200/40 hover:shadow-pink-300/60",
    accent:
      "before:from-pink-400/20 before:via-rose-400/20 before:to-red-400/20",
  },
  {
    background: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
    border: "ring-amber-200/60 hover:ring-amber-300/80",
    shadow: "shadow-amber-200/40 hover:shadow-amber-300/60",
    accent:
      "before:from-amber-400/20 before:via-yellow-400/20 before:to-orange-400/20",
  },
  {
    background: "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50",
    border: "ring-violet-200/60 hover:ring-violet-300/80",
    shadow: "shadow-violet-200/40 hover:shadow-violet-300/60",
    accent:
      "before:from-violet-400/20 before:via-purple-400/20 before:to-fuchsia-400/20",
  },
  {
    background: "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50",
    border: "ring-slate-200/60 hover:ring-slate-300/80",
    shadow: "shadow-slate-200/40 hover:shadow-slate-300/60",
    accent:
      "before:from-slate-400/20 before:via-gray-400/20 before:to-zinc-400/20",
  },
];

/**
 * Obtiene un color de tarjeta basado en el ID de la tarjeta
 */
export function getCardColor(cardId: string) {
  const hash = cardId.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  const index = Math.abs(hash) % cardColorPalettes.length;
  return cardColorPalettes[index];
}
