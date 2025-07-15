export const userActionTracker = {
  /**
   * Marca una acción del usuario para prevenir auto-notificaciones
   */
  markAction: (actionType: string, entityId: string) => {
    const actionKey = `${actionType}:${entityId}`;
    const sessionKey = `user-action-${actionKey}`;
    sessionStorage.setItem(sessionKey, Date.now().toString());

    // Limpieza automática después de 5 segundos (un poco más de tiempo para mayor seguridad)
    setTimeout(() => {
      sessionStorage.removeItem(sessionKey);
    }, 5000);
  },

  /**
   * Verifica si una acción fue realizada por el usuario actual
   */
  isUserAction: (actionType: string, entityId: string): boolean => {
    const actionKey = `${actionType}:${entityId}`;
    const sessionKey = `user-action-${actionKey}`;
    const timestamp = sessionStorage.getItem(sessionKey);

    if (!timestamp) return false;

    const actionTime = parseInt(timestamp);
    const now = Date.now();

    // Si la acción fue hace menos de 5 segundos, es una acción del usuario
    if (now - actionTime < 5000) {
      return true;
    } else {
      // Limpia la acción expirada
      sessionStorage.removeItem(sessionKey);
      return false;
    }
  },
};
