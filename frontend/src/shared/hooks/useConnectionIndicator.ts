"use client";

import { useRealtimeStore } from "@/shared/stores/realtimeStore";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

/**
 * Hook personalizado para manejar la lógica del indicador de conexión
 * Gestiona el estado de conexión en tiempo real y proporciona información visual
 */
export function useConnectionIndicator() {
  const { isConnected, isReconnecting, connectedUsers, lastUpdate } =
    useRealtimeStore();

  /**
   * Determina el estado visual de la conexión
   * @returns Objeto con ícono, texto y estilos según el estado de conexión
   */
  const getStatusInfo = () => {
    if (isReconnecting) {
      return {
        icon: Loader2,
        text: "Reconectando...",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    }

    if (isConnected) {
      return {
        icon: Wifi,
        text: "Conectado",
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }

    return {
      icon: WifiOff,
      text: "Desconectado",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  };

  /**
   * Formatea la fecha de última actualización en texto legible
   * @param date - Fecha de la última actualización
   * @returns Texto formateado ("hace un momento", "hace 5m", "hace 2h") o null
   */
  const formatLastUpdate = (date: Date | null) => {
    if (!date) return null;

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      // menos de 1 minuto
      return "hace un momento";
    } else if (diff < 3600000) {
      // menos de 1 hora
      const minutes = Math.floor(diff / 60000);
      return `hace ${minutes}m`;
    } else {
      const hours = Math.floor(diff / 3600000);
      return `hace ${hours}h`;
    }
  };

  const status = getStatusInfo();

  return {
    status,
    isConnected,
    isReconnecting,
    connectedUsers,
    lastUpdate,
    formatLastUpdate,
  };
}
