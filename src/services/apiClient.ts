
import { API_BASE_URL } from '@/config/serverConfig';
import authService from './authService';
import { toast } from 'sonner';

/**
 * API Client for making authenticated requests to the backend
 */
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipErrorToast?: boolean;
}

class ApiClient {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  // Helper method to build request with authentication
  private async buildRequest(options: RequestOptions = {}): Promise<RequestInit> {
    const { skipAuth = false, ...fetchOptions } = options;
    
    const headers = new Headers(fetchOptions.headers);
    
    // Set content type if not specified
    if (!headers.has('Content-Type') && !fetchOptions.body?.toString().includes('FormData')) {
      headers.set('Content-Type', 'application/json');
    }
    
    // Add authentication token if required
    if (!skipAuth) {
      const token = authService.getToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      } else {
        // Redirect to login if no token is available
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
    }
    
    return {
      ...fetchOptions,
      headers
    };
  }
  
  // Generic request method
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      const { skipErrorToast = false, ...fetchOptions } = options;
      const requestOptions = await this.buildRequest(fetchOptions);
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, requestOptions);
      
      // Handle 401 Unauthorized - Token expired
      if (response.status === 401) {
        try {
          // Try to refresh token
          await authService.refreshToken();
          
          // Retry request with new token
          const newRequestOptions = await this.buildRequest(fetchOptions);
          const newResponse = await fetch(url, newRequestOptions);
          
          if (!newResponse.ok) {
            throw new Error(`HTTP error ${newResponse.status}: ${newResponse.statusText}`);
          }
          
          return await newResponse.json();
        } catch (refreshError) {
          // If refresh fails, redirect to login
          authService.logout();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      // Handle other errors
      if (!response.ok) {
        let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Ignore JSON parsing errors
        }
        
        if (!skipErrorToast) {
          toast.error(errorMessage);
        }
        
        throw new Error(errorMessage);
      }
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else if (response.status === 204) {
        return {} as T; // No content
      } else {
        return await response.text() as unknown as T;
      }
    } catch (error) {
      if (!options.skipErrorToast) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      }
      throw error;
    }
  }
  
  // HTTP Methods
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  async post<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }
  
  async put<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }
  
  async patch<T>(endpoint: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data instanceof FormData ? data : JSON.stringify(data)
    });
  }
  
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
  
  // Upload file
  async uploadFile<T>(endpoint: string, file: File, additionalData: Record<string, any> = {}, options: RequestOptions = {}): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData
    });
  }
  
  // Download file
  async downloadFile(endpoint: string, filename: string, options: RequestOptions = {}): Promise<void> {
    try {
      const requestOptions = await this.buildRequest({ ...options, method: 'GET' });
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create URL from blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      if (!options.skipErrorToast) {
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
      }
      throw error;
    }
  }
}

// Create instance with API base URL
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
