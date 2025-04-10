
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

const login = (user: User, token: string): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

const logout = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
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

const isAuthenticated = (): boolean => {
  return !!getToken();
};

const authService = {
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated
};

export default authService;
