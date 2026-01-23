// src/utils/auth.ts
import { User } from '../types';

export const useAuth = (): { user: User | null; token: string | null; isAuthenticated: boolean } => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  if (token && userData) {
    try {
      const user = JSON.parse(userData) as User;
      return { user, token, isAuthenticated: true };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  return { user: null, token: null, isAuthenticated: false };
};

export const loginUser = (user: User, token: string) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
