import { create } from 'zustand';
import {type  User } from '../types/index';

interface AuthState {
  token: string | null;
  user:  User  | null;
  isAuthenticated: boolean;
  setAuth:   (token: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:           localStorage.getItem('token'),
  user:            JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));