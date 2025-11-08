// frontend/src/store/authStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 'persist' middleware will save the state to localStorage
// This way, the user stays logged in even after refreshing the page

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,   // User object { _id, email }
      token: null,  // The JWT token string

      // Action to set user and token (on login/register)
      login: (userData, token) => set({ user: userData, token: token }),

      // Action to clear user and token (on logout)
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // Name for the localStorage item
    }
  )
);