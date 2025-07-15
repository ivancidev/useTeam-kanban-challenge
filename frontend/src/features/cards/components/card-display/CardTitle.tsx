interface CardTitleProps {
  title: string;
  hasActionButtons: boolean;
}

export function CardTitle({ title, hasActionButtons }: CardTitleProps) {
  return (
    <h4
      className={`font-semibold text-gray-900 text-sm leading-tight mb-2 overflow-hidden break-words
                    ${hasActionButtons ? "pr-20" : "pr-2"}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        lineHeight: "1.2",
        maxHeight: "1.2em", // 1 línea × 1.2 line-height
      }}
    >
      {title}
    </h4>
  );
}
