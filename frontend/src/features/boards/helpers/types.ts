// Tipos específicos para los helpers de boards
import type { Card } from "../../cards/types";

/**
 * Resultado de la búsqueda de una tarjeta en las columnas
 */
export interface CardSearchResult {
  card: Card | null;
  columnId: string | null;
  order: number | null;
}

/**
 * Handler para operaciones asíncronas con estado de loading y error
 */
export type AsyncHandler = <T>(
  operation: () => Promise<T>,
  successMessage?: string,
  errorMessage?: string
) => Promise<T>;

/**
 * Handler para actualizaciones optimistas con rollback
 */
export type OptimisticHandler = <T>(
  optimisticUpdate: () => void,
  apiCall: () => Promise<T>,
  rollback: () => void,
  successMessage?: string,
  errorMessage?: string
) => Promise<T>;

/**
 * Parámetros para crear un handler asíncrono
 */
export interface AsyncHandlerParams {
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}

/**
 * Parámetros para crear un handler optimista
 */
export interface OptimisticHandlerParams {
  setError: (error: string | null) => void;
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
}
