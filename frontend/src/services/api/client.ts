// Get the API base URL from environment or use localhost
const getApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  console.log('[API Client] Environment VITE_API_URL:', envUrl);
  
  if (envUrl) {
    return envUrl;
  }
  // Default to localhost:5000 for development
  console.log('[API Client] Using default localhost:5000');
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
console.log('[API Client] API_BASE_URL set to:', API_BASE_URL);

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log(`[API] Response: ${response.status} ${response.statusText}`);
    return response;
  } catch (error) {
    console.error(`[API] Error: ${error}`);
    throw error;
  }
}

export async function apiPost<T>(
  endpoint: string,
  data?: Record<string, any>
): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}
