import { uiIcons } from "@/shared/helpers/iconHelpers";

interface CardContentIndicatorsProps {
  hasDescription: boolean;
  hasComments: boolean;
}

export function CardContentIndicators({
  hasDescription,
  hasComments,
}: CardContentIndicatorsProps) {
  if (!hasDescription && !hasComments) return null;

  return (
    <div className="flex items-center gap-2 mt-auto">
      {hasDescription && (
        <div
          className="bg-blue-500 text-white rounded-full p-1 shadow-sm"
          title="Tiene descripción"
        >
          <uiIcons.description className="h-3 w-3" />
        </div>
      )}
      {hasComments && (
        <div
          className="bg-purple-500 text-white rounded-full p-1 shadow-sm"
          title="Tiene comentarios"
        >
          <uiIcons.comment className="h-3 w-3" />
        </div>
      )}
    </div>
  );
}
