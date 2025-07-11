import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UseColumnDragHandleProps {
  columnId: string;
  index: number;
}

export const useColumnDragHandle = ({
  columnId,
  index,
}: UseColumnDragHandleProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `column-${columnId}`,
    data: {
      type: "column",
      columnId,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return {
    dragRef: setNodeRef,
    dragHandleProps: {
      ...attributes,
      ...listeners,
    },
    style,
    isDragging,
  };
};
