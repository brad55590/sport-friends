/**
 * Determines whether to use mocks or real API
 * The mock context sets this in localStorage
 */
export function shouldUseMocks(): boolean {
  try {
    const stored = localStorage.getItem('useMocks');
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[API Config] Failed to read useMocks from localStorage:', e);
  }
  return false; // Default to real API
}

// Get the API base URL from environment or use localhost
export const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl) {
    console.log('[API Client] Using VITE_API_URL:', envUrl);
    return envUrl;
  }
  
  // Default to localhost:5000 for development
  console.log('[API Client] Using default http://localhost:5000');
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
