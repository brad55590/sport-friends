import { createContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { apiPost } from '../services/api/client';

export interface Sport {
  id: string;
  name: string;
  icon?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  bio?: string;
  avatar?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  sports?: Sport[];
}

export interface UserProfile extends User {
  bio: string;
  avatar: string;
  sports: Sport[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_ERROR'; payload: string }
  | { type: 'UPDATE_PROFILE_START' }
  | { type: 'UPDATE_PROFILE_SUCCESS'; payload: User }
  | { type: 'UPDATE_PROFILE_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_SESSION'; payload: User };

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const STORAGE_KEY = 'sportfriends_auth';

// Load auth state from localStorage
function loadAuthFromStorage(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('[Auth] Loaded auth state from localStorage:', {
        user: parsed.user?.email,
        sports: parsed.user?.sports?.length || 0,
        sportsArray: parsed.user?.sports,
      });
      return parsed;
    }
  } catch (err) {
    console.error('[Auth] Failed to load auth from localStorage:', err);
  }
  return initialState;
}

// Save auth state to localStorage
function saveAuthToStorage(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    console.log('[Auth] Saved auth state to localStorage:', {
      user: state.user?.email,
      sports: state.user?.sports?.length || 0,
    });
  } catch (err) {
    console.error('[Auth] Failed to save auth to localStorage:', err);
  }
}

// Clear auth state from localStorage
function clearAuthFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Auth] Cleared auth state from localStorage');
  } catch (err) {
    console.error('[Auth] Failed to clear auth from localStorage:', err);
  }
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  let newState: AuthState;
  
  switch (action.type) {
    case 'LOGIN_START':
      newState = { ...state, isLoading: true, error: null };
      break;
    case 'LOGIN_SUCCESS':
      newState = { ...state, user: action.payload, isLoading: false, error: null };
      saveAuthToStorage(newState);
      break;
    case 'LOGIN_ERROR':
      newState = { ...state, isLoading: false, error: action.payload, user: null };
      clearAuthFromStorage();
      break;
    case 'LOGOUT':
      newState = { ...state, user: null, isLoading: false, error: null };
      clearAuthFromStorage();
      break;
    case 'REGISTER_START':
      newState = { ...state, isLoading: true, error: null };
      break;
    case 'REGISTER_SUCCESS':
      newState = { ...state, user: action.payload, isLoading: false, error: null };
      saveAuthToStorage(newState);
      break;
    case 'REGISTER_ERROR':
      newState = { ...state, isLoading: false, error: action.payload, user: null };
      clearAuthFromStorage();
      break;
    case 'UPDATE_PROFILE_START':
      newState = { ...state, isLoading: true, error: null };
      break;
    case 'UPDATE_PROFILE_SUCCESS':
      newState = { ...state, user: action.payload, isLoading: false, error: null };
      saveAuthToStorage(newState);
      break;
    case 'UPDATE_PROFILE_ERROR':
      newState = { ...state, isLoading: false, error: action.payload };
      break;
    case 'CLEAR_ERROR':
      newState = { ...state, error: null };
      break;
    case 'RESTORE_SESSION':
      newState = { ...state, user: action.payload };
      break;
    default:
      return state;
  }
  
  return newState;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState, loadAuthFromStorage);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const stored = loadAuthFromStorage();
    if (stored.user) {
      console.log('[Auth] Restoring user from localStorage:', stored.user.email);
      dispatch({ type: 'LOGIN_SUCCESS', payload: stored.user });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await apiPost<User>('/api/v1/auth/login', { email, password });
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (err) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: err instanceof Error ? err.message : 'Login failed',
      });
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      dispatch({ type: 'REGISTER_START' });
      try {
        const user = await apiPost<User>('/api/v1/auth/register', {
          email,
          password,
          firstName,
          lastName,
        });
        dispatch({ type: 'REGISTER_SUCCESS', payload: user });
      } catch (err) {
        dispatch({
          type: 'REGISTER_ERROR',
          payload: err instanceof Error ? err.message : 'Registration failed',
        });
      }
    },
    []
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_PROFILE_START' });
    try {
      const updatedUser = await apiPost<User>('/api/v1/users/profile', profile);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedUser });
    } catch (err) {
      dispatch({
        type: 'UPDATE_PROFILE_ERROR',
        payload: err instanceof Error ? err.message : 'Failed to update profile',
      });
    }
  }, []);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: !!state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
