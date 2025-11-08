// frontend/src/store/themeStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // Default theme

      // Action to toggle the theme
      toggleTheme: () => {
        set({ theme: get().theme === 'light' ? 'dark' : 'light' });
      },
    }),
    {
      name: 'theme-storage', // Name for the localStorage item
    }
  )
);