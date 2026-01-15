import { ErrorContextType } from '../context/ErrorContext';

/**
 * Global error handler service for API calls and other operations
 * This allows centralized error handling across the application
 */

let errorContextInstance: ErrorContextType | null = null;

/**
 * Initialize the error handler with an ErrorContext instance
 * Should be called once during app initialization
 */
export function initializeErrorHandler(errorContext: ErrorContextType) {
  errorContextInstance = errorContext;
}

/**
 * Handle an error and display it to the user
 * Can be used in API interceptors, error boundaries, or manually in catch blocks
 */
export function handleError(
  error: Error | string | any,
  defaultMessage: string = 'An unexpected error occurred',
  duration?: number
) {
  if (!errorContextInstance) {
    console.error('[ErrorHandler] ErrorContext not initialized:', error);
    return;
  }

  let message = defaultMessage;
  let severity: 'error' | 'warning' | 'info' = 'error';

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message || defaultMessage;
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  }

  errorContextInstance.addError(message, severity, duration);
}

/**
 * Handle a successful operation message (optional)
 */
export function handleSuccess(message: string, duration: number = 3000) {
  if (!errorContextInstance) {
    console.log('[ErrorHandler] Success (context not initialized):', message);
    return;
  }

  errorContextInstance.addError(message, 'info', duration);
}

/**
 * Clear all errors
 */
export function clearAllErrors() {
  if (!errorContextInstance) {
    return;
  }

  errorContextInstance.clearAll();
}
