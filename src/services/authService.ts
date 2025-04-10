
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/serverConfig';

/**
 * Authentication Service
 * Handles JWT-based authentication with the backend
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    fieldOffice: string;
    jobTitle: string;
    active: boolean;
    lastLogin: string;
  };
  token: string;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string | null;
  fieldOffice: string;
  jobTitle: string;
  active: boolean;
  lastLogin: string | null;
  name?: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // For development/testing without backend
      if (process.env.NODE_ENV === 'development' && !process.env.USE_BACKEND) {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        if (credentials.email === 'admin@mems.org' && credentials.password === 'admin123') {
          const mockResponse: AuthResponse = {
            user: {
              id: 'currentUser',
              firstName: 'Admin',
              lastName: 'User',
              email: 'admin@mems.org',
              role: 'administrator',
              fieldOffice: 'Siège',
              jobTitle: 'System Administrator',
              active: true,
              lastLogin: new Date().toISOString(),
            },
            token: 'mock-jwt-token-for-development'
          };
          
          // Store in localStorage
          localStorage.setItem(TOKEN_KEY, mockResponse.token);
          localStorage.setItem(USER_KEY, JSON.stringify(mockResponse.user));
          
          return mockResponse;
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      // Actual backend integration
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data: AuthResponse = await response.json();
      
      // Store token and user data
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(message);
      throw error;
    }
  },
  
  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  // Get current user from localStorage
  getCurrentUser: (): CurrentUser | null => {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // Get JWT token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  // Logout user
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  // Refresh token (to be implemented with backend)
  refreshToken: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const data = await response.json();
      localStorage.setItem(TOKEN_KEY, data.token);
      
      return data.token;
    } catch (error) {
      // If token refresh fails, logout user
      authService.logout();
      throw error;
    }
  },
  
  // Register a new user (for admin use)
  registerUser: async (userData: Partial<CurrentUser>): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(message);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userId: string, updates: Partial<CurrentUser>): Promise<CurrentUser> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }
      
      const updatedUser = await response.json();
      
      // If updating current user, update localStorage
      if (userId === authService.getCurrentUser()?.id) {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }
      
      return updatedUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(message);
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(message);
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(message);
      throw error;
    }
  }
};

export default authService;
