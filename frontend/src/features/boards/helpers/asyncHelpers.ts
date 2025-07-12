/**
 * Helper para manejar operaciones asíncronas con loading y error handling
 */
export const createAsyncHandler = (
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  notifySuccess: (message: string) => void,
  notifyError: (message: string) => void
) => {
  return async <T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await operation();

      if (successMessage) {
        notifySuccess(successMessage);
      }

      return result;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : errorMessage || "Error desconocido";
      setError(message);
      if (errorMessage) {
        notifyError(errorMessage);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
};

/**
 * Helper para actualizaciones optimistas con rollback automático
 */
export const createOptimisticHandler = (
  setError: (error: string | null) => void,
  notifySuccess: (message: string) => void,
  notifyError: (message: string) => void
) => {
  return async <T>(
    optimisticUpdate: () => void,
    apiCall: () => Promise<T>,
    rollback: () => void,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T> => {
    // Aplicar actualización optimista
    optimisticUpdate();

    try {
      const result = await apiCall();

      if (successMessage) {
        notifySuccess(successMessage);
      }

      return result;
    } catch (err) {
      // Rollback en caso de error
      rollback();

      const message =
        err instanceof Error
          ? err.message
          : errorMessage || "Error desconocido";
      setError(message);
      if (errorMessage) {
        notifyError(errorMessage);
      }
      throw err;
    }
  };
};
