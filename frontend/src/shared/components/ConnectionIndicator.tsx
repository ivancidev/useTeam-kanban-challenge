"use client";

import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { useConnectionIndicator } from "@/shared/hooks/useConnectionIndicator";
import { ConnectionIndicatorProps } from "../types";



export function ConnectionIndicator({
  className,
  showUsers = true,
  showLastUpdate = false,
}: ConnectionIndicatorProps) {
  const {
    status,
    isConnected,
    isReconnecting,
    connectedUsers,
    lastUpdate,
    formatLastUpdate,
  } = useConnectionIndicator();

  const Icon = status.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
        status.bgColor,
        status.borderColor,
        status.color,
        className
      )}
    >
      <Icon className={cn("h-4 w-4", isReconnecting && "animate-spin")} />

      <span>{status.text}</span>

      {showUsers && isConnected && connectedUsers > 0 && (
        <div className="flex items-center gap-1 ml-1 pl-2 border-l border-current border-opacity-20">
          <Users className="h-3 w-3" />
          <span className="text-xs">{connectedUsers}</span>
        </div>
      )}

      {showLastUpdate && lastUpdate && (
        <div className="ml-1 pl-2 border-l border-current border-opacity-20">
          <span className="text-xs opacity-75">
            {formatLastUpdate(lastUpdate)}
          </span>
        </div>
      )}
    </div>
  );
}
