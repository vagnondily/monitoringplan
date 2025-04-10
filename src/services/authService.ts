
// Simple authentication service

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

const USER_KEY = 'auth_user';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

const login = (user: User, token: string, refreshToken: string = ''): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const logout = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Mock token refresh functionality
const refreshToken = async (): Promise<string> => {
  // In a real application, this would make an API call to refresh the token
  const currentRefreshToken = getRefreshToken();
  
  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new mock token
  const newToken = `new_token_${Date.now()}`;
  
  // Save the new token
  localStorage.setItem(TOKEN_KEY, newToken);
  
  return newToken;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  getRefreshToken,
  isAuthenticated,
  refreshToken
};

export default authService;
