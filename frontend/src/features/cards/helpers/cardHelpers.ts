/**
 * Valida si un título de tarjeta es válido
 */
export function isValidCardTitle(title: string): boolean {
  return title.trim().length > 0;
}

/**
 * Limpia y formatea los datos de una tarjeta para guardar
 */
export function sanitizeCardData(title: string, description: string) {
  return {
    title: title.trim(),
    description: description.trim(),
  };
}

/**
 * Verifica si los datos de la tarjeta han cambiado
 */
export function hasCardDataChanged(
  original: { title: string; description?: string },
  updated: { title: string; description: string }
): boolean {
  return (
    original.title !== updated.title ||
    (original.description || "") !== updated.description
  );
}

/**
 * Formatea la fecha para mostrar en la UI
 */
export function formatCardDate(date: Date): string {
  return new Date(date).toLocaleDateString("es-ES");
}

/**
 * Valida si un comentario es válido
 */
export function isValidComment(comment: string): boolean {
  return comment.trim().length > 0;
}

/**
 * Valida los datos del formulario de tarjeta
 */
export function validateCardForm(title: string): { title?: string } {
  const errors: { title?: string } = {};

  if (!isValidCardTitle(title)) {
    errors.title = "El título es requerido";
  }

  return errors;
}

/**
 * Prepara los datos de la tarjeta para envío
 */
export function prepareCardDataForSubmission(
  title: string,
  description: string
): { title: string; description?: string } {
  const sanitized = sanitizeCardData(title, description);
  return {
    title: sanitized.title,
    description: sanitized.description || undefined,
  };
}
