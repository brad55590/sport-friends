import { API_BASE_URL, shouldUseMocks } from './config';

const TOKEN_STORAGE_KEY = 'sportfriends_token';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const useMocks = shouldUseMocks();
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  
  console.log(`[API] ${useMocks ? '(MOCK) ' : ''}${method} ${url}`);

  try {
    // Get token from localStorage for Authorization header
    let token: string | null = null;
    try {
      token = localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('[API] Unable to read token from localStorage');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[API] Added Authorization header');
    }

    const response = await fetch(url, {
      headers,
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

export async function apiPut<T>(
  endpoint: string,
  data?: Record<string, any>
): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}
