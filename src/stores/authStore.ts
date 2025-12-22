/**
 * Auth Store
 * 
 * Zustand store for authentication state management with persistence.
 * Handles login, logout, token management, and user data.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasLoggedInBefore: boolean;
  biometricEnabled: boolean; // Track if user has enabled biometric
  
  // Actions
  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setBiometricEnabled: (enabled: boolean) => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      hasLoggedInBefore: false,
      biometricEnabled: false,

      // Actions
      setTokens: (token, refreshToken) => {
        set({ token, refreshToken, isAuthenticated: !!token });
      },

      setUser: (user) => {
        set({ user });
      },

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          hasLoggedInBefore: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          // Keep hasLoggedInBefore as true even after logout
          // Keep biometricEnabled as is (user preference persists)
        });
      },

      updateUser: (userUpdates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null,
        }));
      },

      setBiometricEnabled: (enabled) => {
        set({ biometricEnabled: enabled });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        hasLoggedInBefore: state.hasLoggedInBefore,
        biometricEnabled: state.biometricEnabled,
      }),
    }
  )
);

