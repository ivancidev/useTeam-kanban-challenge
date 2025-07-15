import { CardDueDateDisplay } from "../ui";

interface CardDueDateSectionProps {
  dueDate: string;
  hasDueDate: boolean;
}

export function CardDueDateSection({
  dueDate,
  hasDueDate,
}: CardDueDateSectionProps) {
  if (!hasDueDate) return null;

  return (
    <div className="mb-2">
      <CardDueDateDisplay dueDate={dueDate} size="sm" />
    </div>
  );
}
