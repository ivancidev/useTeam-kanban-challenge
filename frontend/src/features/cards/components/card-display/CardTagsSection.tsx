import { CardTagsDisplay } from "../ui";

interface CardTagsSectionProps {
  tags: string[];
  hasTags: boolean;
}

export function CardTagsSection({ tags, hasTags }: CardTagsSectionProps) {
  if (!hasTags) return null;

  return (
    <div className="mb-2">
      <CardTagsDisplay tags={tags} maxVisible={2} size="sm" />
    </div>
  );
}
