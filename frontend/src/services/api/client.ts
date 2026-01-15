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
      redirect: 'manual', // Don't automatically follow redirects
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

  // Handle redirects (should not happen for API calls, but just in case)
  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('Location');
    console.error(`[API] Unexpected redirect to ${redirectUrl}, treating as error`);
    throw new Error(`Unexpected redirect: ${redirectUrl}`);
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = 'API request failed';
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        // Handle API error response with validation errors
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
        // If there are field errors, append them
        if (errorData.error?.fieldErrors) {
          const fieldErrors = Object.entries(errorData.error.fieldErrors)
            .map(([field, errors]: [string, any]) => {
              const errorArray = Array.isArray(errors) ? errors : [errors];
              return errorArray.join(', ');
            })
            .join('; ');
          if (fieldErrors) {
            errorMessage = errorData.error.message + ': ' + fieldErrors;
          }
        }
      } else {
        errorMessage = await response.text();
      }
    } catch (e) {
      console.error('[API] Error parsing error response:', e);
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiCall(endpoint, {
    method: 'GET',
  });

  // Handle redirects
  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('Location');
    console.error(`[API] Unexpected redirect to ${redirectUrl}, treating as error`);
    throw new Error(`Unexpected redirect: ${redirectUrl}`);
  }

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

  // Handle redirects
  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('Location');
    console.error(`[API] Unexpected redirect to ${redirectUrl}, treating as error`);
    throw new Error(`Unexpected redirect: ${redirectUrl}`);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }

  return response.json();
}
