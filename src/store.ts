import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AppState {
  token: string | null;
  user: { id: number; name: string; roles: string[] } | null;
  setToken: (token: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => {
        if (token) {
          const decoded = jwtDecode<{ sub: string; roles: string[], id: number }>(token);
          set({ token, user: { id: decoded.id, name: decoded.sub, roles: decoded.roles } });
        } else {
          set({ token: null, user: null });
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);