"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCardFormDialog } from "../hooks";
import { CardFormDialogProps, CardPriority, CardType } from "../types";
import {
  CARD_PRIORITY_OPTIONS,
  CARD_TYPE_OPTIONS,
  PREDEFINED_TAGS,
} from "../helpers/cardHelpers";
import { X } from "lucide-react";
import { useState } from "react";

export function CardFormDialog({
  isOpen,
  onClose,
  onSubmit,
  onEdit,
  card,
  columnId,
  isLoading = false,
}: CardFormDialogProps) {
  const {
    title,
    description,
    comments,
    dueDate,
    priority,
    type,
    tags,
    errors,
    isEditing,
    setTitle,
    setDescription,
    setComments,
    setDueDate,
    setPriority,
    setType,
    setTags,
    handleSubmit,
    handleClose,
  } = useCardFormDialog({
    card,
    columnId,
    onSubmit,
    onEdit,
    onClose,
    isLoading,
  });

  const [newTag, setNewTag] = useState("");

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar tarjeta" : "Crear nueva tarjeta"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Modifica los detalles de la tarjeta."
                : "Agrega una nueva tarjeta a la columna."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ingresa el título de la tarjeta"
                className={errors.title ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.title && (
                <span className="text-sm text-red-500">{errors.title}</span>
              )}
            </div>

            {/* Tipo y Prioridad en una fila */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as CardType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARD_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as CardPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CARD_PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Fecha límite */}
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Fecha límite</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate ? dueDate.split("T")[0] : ""}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional de la tarjeta"
                rows={3}
                className="min-h-[80px] max-h-[120px] resize-none overflow-y-auto"
                disabled={isLoading}
              />
            </div>

            {/* Comentarios */}
            <div className="grid gap-2">
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Comentarios adicionales..."
                rows={2}
                className="min-h-[60px] max-h-[100px] resize-none overflow-y-auto"
                disabled={isLoading}
              />
            </div>

            {/* Etiquetas */}
            <div className="grid gap-2">
              <Label htmlFor="tags">Etiquetas</Label>

              {/* Etiquetas existentes */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-1 text-xs"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-gray-300 rounded-full"
                        onClick={() => removeTag(tag)}
                        disabled={isLoading}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Input para nueva etiqueta */}
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Agregar etiqueta y presionar Enter"
                disabled={isLoading}
              />

              {/* Etiquetas sugeridas */}
              <div className="flex flex-wrap gap-1">
                {PREDEFINED_TAGS.filter((tag) => !tags.includes(tag))
                  .slice(0, 6)
                  .map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => addTag(tag)}
                      disabled={isLoading}
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
