import { create } from "zustand";

export interface UserState {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  role: string;
  organization?: {
    id: string;
    businessName: string;
    ruc: string;
  } | null;
}

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
