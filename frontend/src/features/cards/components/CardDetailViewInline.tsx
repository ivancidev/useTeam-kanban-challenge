"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardPriority, CardType, UpdateCardDto } from "../types";
import {
  CardPriorityBadge,
  CardTypeBadge,
  CardDueDateDisplay,
  CardTagsDisplay,
} from "./ui";
import {
  CARD_PRIORITY_OPTIONS,
  CARD_TYPE_OPTIONS,
  PREDEFINED_TAGS,
  formatCardDate,
} from "../helpers/cardHelpers";
import { useInlineCardEdit } from "../hooks/useInlineCardEdit";
import {
  Edit,
  Calendar,
  MessageSquare,
  Tag,
  FileText,
  Clock,
  Save,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";

interface CardDetailViewInlineProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card;
  columnName?: string;
  onUpdate: (data: UpdateCardDto) => Promise<void>;
}

export function CardDetailViewInline({
  isOpen,
  onClose,
  card,
  columnName = "Sin columna",
  onUpdate,
}: CardDetailViewInlineProps) {
  const {
    isEditing,
    isSaving,
    title,
    description,
    comments,
    dueDate,
    priority,
    type,
    tags,
    setTitle,
    setDescription,
    setComments,
    setDueDate,
    setPriority,
    setType,
    startEditing,
    cancelEditing,
    saveChanges,
    addTag,
    removeTag,
  } = useInlineCardEdit({ card, onUpdate });

  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setNewTag("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Manejar atajos de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing && e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      saveChanges();
    }
    if (isEditing && e.key === "Escape") {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-none h-[85vh] overflow-hidden p-0 border-2 border-gray-300 shadow-xl"
        style={{ width: "min(1200px, 90vw)", maxWidth: "none" }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Título editable */}
                  {isEditing ? (
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xl font-bold mb-2 h-auto py-2 border-0 bg-transparent focus:bg-white focus:border-gray-300"
                      placeholder="Título de la tarjeta"
                      disabled={isSaving}
                    />
                  ) : (
                    <DialogTitle
                      className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={startEditing}
                    >
                      {card.title}
                    </DialogTitle>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>en la lista</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                    {columnName}
                  </span>
                  {/* Indicador de modo edición */}
                  {isEditing && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Editando
                    </span>
                  )}
                </div>

                {/* Botón de editar */}
                {!isEditing && (
                  <Button
                    onClick={startEditing}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          <div
            className="flex-1 overflow-y-auto px-6 py-4"
            style={{ maxHeight: "calc(85vh - 140px)" }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Columna izquierda */}
              <div className="space-y-6">
                {/* Tipo y Prioridad */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4" />
                    Tipo y Prioridad
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <Select
                        value={type}
                        onValueChange={(value) => setType(value as CardType)}
                      >
                        <SelectTrigger className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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

                      <Select
                        value={priority}
                        onValueChange={(value) =>
                          setPriority(value as CardPriority)
                        }
                      >
                        <SelectTrigger className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
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
                  ) : (
                    <div className="flex gap-2">
                      <CardTypeBadge type={card.type} size="md" />
                      <CardPriorityBadge priority={card.priority} size="md" />
                    </div>
                  )}
                </div>

                {/* Fecha límite */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    Fecha límite
                  </div>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={dueDate ? dueDate.split("T")[0] : ""}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      disabled={isSaving}
                    />
                  ) : dueDate ? (
                    <CardDueDateDisplay dueDate={dueDate} size="md" />
                  ) : (
                    <span
                      className="text-gray-500 text-sm cursor-pointer hover:text-gray-700"
                      onClick={startEditing}
                    >
                      Hacer clic para agregar fecha límite
                    </span>
                  )}
                </div>

                {/* Etiquetas */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4" />
                    Etiquetas
                  </div>
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Etiquetas actuales */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-2 px-3 py-2 max-w-[250px] h-8"
                            >
                              <span className="truncate">{tag}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-gray-300 rounded-full flex-shrink-0"
                                onClick={() => removeTag(tag)}
                                disabled={isSaving}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Agregar nueva etiqueta */}
                      <div className="flex gap-3">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="Nueva etiqueta"
                          className="flex-1 h-11 border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          disabled={isSaving}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                          disabled={!newTag.trim() || isSaving}
                          className="h-11 px-4 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Etiquetas sugeridas */}
                      <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS.filter((tag) => !tags.includes(tag))
                          .slice(0, 6)
                          .map((tag) => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs"
                              onClick={() => addTag(tag)}
                              disabled={isSaving}
                            >
                              + {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ) : tags && tags.length > 0 ? (
                    <CardTagsDisplay tags={tags} maxVisible={10} size="md" />
                  ) : (
                    <span
                      className="text-gray-500 text-sm cursor-pointer hover:text-gray-700"
                      onClick={startEditing}
                    >
                      Hacer clic para agregar etiquetas
                    </span>
                  )}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-6">
                {/* Descripción */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Agregar descripción..."
                      rows={6}
                      className="min-h-[140px] resize-none w-full border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      disabled={isSaving}
                    />
                  ) : description ? (
                    <div
                      className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border min-h-[140px] break-words overflow-hidden cursor-pointer hover:bg-gray-100"
                      onClick={startEditing}
                    >
                      {description}
                    </div>
                  ) : (
                    <div
                      className="text-gray-500 text-sm cursor-pointer hover:bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-[140px] flex items-center justify-center hover:border-gray-400 transition-colors"
                      onClick={startEditing}
                    >
                      Hacer clic para agregar descripción...
                    </div>
                  )}
                </div>

                {/* Comentarios */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MessageSquare className="h-4 w-4" />
                    Comentarios
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Agregar comentarios..."
                      rows={4}
                      className="min-h-[100px] resize-none w-full border-2 border-gray-300 bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      disabled={isSaving}
                    />
                  ) : comments ? (
                    <div
                      className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap border border-purple-200 min-h-[100px] break-words overflow-hidden cursor-pointer hover:bg-purple-100"
                      onClick={startEditing}
                    >
                      {comments}
                    </div>
                  ) : (
                    <div
                      className="text-gray-500 text-sm cursor-pointer hover:bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-[100px] flex items-center justify-center hover:border-gray-400 transition-colors"
                      onClick={startEditing}
                    >
                      Hacer clic para agregar comentarios...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información de fechas - ancho completo */}
            <div className="space-y-3 pt-6 border-t-2 border-gray-200 mt-8 mb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Información de fechas
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Creada:</span>
                  <span className="break-words">
                    {formatCardDate(card.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Actualizada:</span>
                  <span className="break-words">
                    {formatCardDate(card.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones de acción cuando está editando */}
          {isEditing && (
            <div className="border-t-2 bg-gray-50 px-6 py-4 flex-shrink-0 sticky bottom-0">
              <div className="flex items-center justify-between w-full">
                <div className="text-xs text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-300 border border-gray-400 rounded shadow-sm font-mono">
                      Ctrl+Enter
                    </kbd>
                    <span className="ml-1">Guardar</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-300 border border-gray-400 rounded shadow-sm font-mono">
                      Esc
                    </kbd>
                    <span className="ml-1">Cancelar</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    disabled={isSaving}
                    className="border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
