"use client";

import { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Calendar,
  Users,
  Tag,
  MessageSquare,
  List,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CardDetailModalProps } from "../types";

export function CardDetailModal({
  isOpen,
  onClose,
  card,
  onSave,
  onDelete,
  columnName,
}: CardDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || "");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar el estado local cuando cambie el card prop, pero solo si no estamos editando
  useEffect(() => {
    if (!isEditing) {
      setTitle(card.title);
      setDescription(card.description || "");
    }
  }, [card, isEditing]);

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving card:", error);
      setTitle(card.title);
      setDescription(card.description || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(card.title);
    setDescription(card.description || "");
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // TODO: Implementar añadir comentario
    setNewComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="!max-w-none h-[75vh] max-h-[600px] overflow-hidden p-0"
        showCloseButton={false}
        style={{ width: "min(1200px, 90vw)", maxWidth: "none" }}
      >
        <VisuallyHidden>
          <DialogTitle>Detalles de la tarjeta: {title}</DialogTitle>
        </VisuallyHidden>
        <div className="flex h-full bg-gradient-to-br from-slate-50 to-white">
          {/* Main Content */}
          <div className="flex-1 min-w-0 p-6 overflow-y-auto">
            {/* Header with title */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-1 shadow-sm">
                <List className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold border-2 border-blue-200 focus:border-blue-400 rounded-lg p-3 h-auto focus:ring-0 shadow-sm"
                    placeholder="Añadir un título más descriptivo..."
                  />
                ) : (
                  <h1
                    className="text-2xl font-bold text-slate-800 cursor-pointer hover:bg-blue-50 rounded-lg p-3 -m-3 transition-colors border-2 border-transparent hover:border-blue-200 break-words"
                    onClick={() => setIsEditing(true)}
                  >
                    {title}
                  </h1>
                )}
                <div className="flex items-center gap-2 mt-2 ml-3">
                  <span className="text-sm text-slate-500">en la lista</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium shadow-sm">
                    {columnName}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg shadow-sm">
                  <Edit3 className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Descripción
                </h2>
              </div>
              {isEditing || description ? (
                <div className="ml-10">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Añadir una descripción más detallada..."
                        className="min-h-[100px] resize-none border-2 border-green-200 focus:border-green-400 rounded-lg shadow-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        >
                          {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleCancel}
                          size="sm"
                          className="text-slate-600 hover:bg-slate-100"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-green-50 rounded-lg p-3 -m-3 transition-colors border-2 border-transparent hover:border-green-200"
                      onClick={() => setIsEditing(true)}
                    >
                      {description ? (
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {description}
                        </p>
                      ) : (
                        <p className="text-slate-500 italic">
                          Añadir una descripción más detallada...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="ml-10">
                  <Button
                    variant="ghost"
                    className="text-left justify-start p-3 h-auto text-slate-500 hover:bg-green-50 rounded-lg border-2 border-dashed border-slate-200 hover:border-green-300 w-full transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <span className="text-left">
                      Añadir una descripción más detallada...
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shadow-sm">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Comentarios y Actividad
                </h2>
              </div>

              {/* Add comment */}
              <div className="ml-10 mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                    U
                  </div>
                  <div className="flex-1 min-w-0">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="min-h-[60px] resize-none border-2 border-purple-200 focus:border-purple-400 rounded-lg shadow-sm"
                    />
                    {newComment && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                        >
                          Comentar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setNewComment("")}
                          className="text-slate-600 hover:bg-slate-100"
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity feed */}
              <div className="ml-10">
                <div className="flex gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                    IZ
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">
                        Ivan Herlan Hebas Zubieta
                      </span>{" "}
                      ha añadido esta tarjeta a{" "}
                      <span className="font-medium text-orange-700">
                        {columnName}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      10 jul 2025, 20:44
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 min-w-[320px] border-l border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-4 flex-shrink-0 overflow-y-auto">
            <div className="space-y-4">
              {/* Quick Info Card */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                    <List className="h-4 w-4" />
                  </div>
                  Información Rápida
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Columna:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                      {columnName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Creada:</span>
                    <span className="text-slate-800 font-semibold text-xs">
                      {new Date(card.createdAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">
                      Actualizada:
                    </span>
                    <span className="text-slate-800 font-semibold text-xs">
                      {new Date(card.updatedAt).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to card */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                    <Calendar className="h-4 w-4" />
                  </div>
                  Añadir a la Tarjeta
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-12 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all p-3"
                  >
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">
                        Miembros
                      </div>
                      <div className="text-xs text-slate-500">
                        Asignar responsables
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-12 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all p-3"
                  >
                    <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                      <Tag className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">
                        Etiquetas
                      </div>
                      <div className="text-xs text-slate-500">
                        Categorizar tarjeta
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-12 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all p-3"
                  >
                    <div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">
                        Fechas
                      </div>
                      <div className="text-xs text-slate-500">
                        Establecer fecha límite
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-12 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all p-3"
                  >
                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-md">
                      <List className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-slate-800 text-sm">
                        Checklist
                      </div>
                      <div className="text-xs text-slate-500">
                        Lista de tareas
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
                    <Archive className="h-4 w-4" />
                  </div>
                  Acciones
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-all p-3"
                    onClick={onDelete}
                  >
                    <div className="p-1.5 bg-red-100 text-red-600 rounded-md">
                      <Archive className="h-4 w-4" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm">Eliminar</div>
                      <div className="text-xs text-red-500">
                        Borrar permanentemente
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-slate-100 shadow-sm border border-slate-200 bg-white transition-all z-30"
        >
          <X className="h-4 w-4 text-slate-600" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
