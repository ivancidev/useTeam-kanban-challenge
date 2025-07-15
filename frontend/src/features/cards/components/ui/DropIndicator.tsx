"use client";

interface DropIndicatorProps {
  isVisible: boolean;
  className?: string;
}

export function DropIndicator({
  isVisible,
  className = "",
}: DropIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div
      className={`
        h-2 mx-3 my-1 rounded-full transition-all duration-200 ease-in-out
        ${className}
      `}
      style={{
        background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
        backgroundSize: "100% 100%",
        animation: "pulse 1s infinite",
        boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)",
      }}
    />
  );
}
