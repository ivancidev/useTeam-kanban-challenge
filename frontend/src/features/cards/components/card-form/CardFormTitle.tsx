import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CardFormTitleProps {
  title: string;
  setTitle: (title: string) => void;
  error?: string;
  isLoading: boolean;
}

export function CardFormTitle({
  title,
  setTitle,
  error,
  isLoading,
}: CardFormTitleProps) {
  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor="title" className="text-base sm:text-lg">
        Título <span className="text-red-500">*</span>
      </Label>
      <Textarea
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ingresa el título de la tarjeta"
        className={`resize-none min-h-[2.5rem] max-h-[8rem] leading-tight w-full text-base sm:text-lg ${
          error ? "border-red-500" : ""
        }`}
        style={{
          lineHeight: "1.4",
          overflow: "hidden",
          scrollbarWidth: "thin",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
        disabled={isLoading}
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          const newHeight = Math.max(40, Math.min(target.scrollHeight, 128));
          target.style.height = newHeight + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            // Prevent default if you want Enter to submit the form
            // e.preventDefault();
          }
        }}
      />
      {error && (
        <span className="text-sm sm:text-base text-red-500 break-words">
          {error}
        </span>
      )}
    </div>
  );
}
