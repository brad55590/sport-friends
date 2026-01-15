import { createContext, useReducer, ReactNode, useCallback } from 'react';

export interface ErrorDetails {
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: number;
  duration?: number; // in milliseconds, undefined = persistent
}

export interface ErrorContextType {
  errors: ErrorDetails[];
  addError: (message: string, severity?: 'error' | 'warning' | 'info', duration?: number) => void;
  removeError: (id: string) => void;
  clearAll: () => void;
}

type ErrorAction =
  | { type: 'ADD_ERROR'; payload: ErrorDetails }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ALL' };

interface ErrorState {
  errors: ErrorDetails[];
}

const initialState: ErrorState = {
  errors: [],
};

function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter((err) => err.id !== action.payload),
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        errors: [],
      };
    default:
      return state;
  }
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  const addError = useCallback(
    (message: string, severity: 'error' | 'warning' | 'info' = 'error', duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      const errorDetails: ErrorDetails = {
        id,
        message,
        severity,
        timestamp: Date.now(),
        duration,
      };

      dispatch({ type: 'ADD_ERROR', payload: errorDetails });

      // Auto-remove error if duration is specified
      if (duration) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_ERROR', payload: id });
        }, duration);
      }
    },
    []
  );

  const removeError = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const value: ErrorContextType = {
    errors: state.errors,
    addError,
    removeError,
    clearAll,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}
