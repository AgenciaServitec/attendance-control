import { create } from "zustand";
import { updateCurrentOrganization } from "@/app/actions/profiles-actions";

export interface ActiveOrganization {
  id: string;
  businessName: string;
  ruc: string;
}

export interface UserState {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  role: string;
  organizations?: ActiveOrganization[];
}

interface UserStore {
  user: UserState | null;
  currentOrganization: ActiveOrganization | null;
  setCurrentOrganization: (org: ActiveOrganization) => Promise<void>;
  setUser: (user: UserState | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  currentOrganization: null,

  setCurrentOrganization: async (org) => {
    set({ currentOrganization: org });

    const res = await updateCurrentOrganization(org.id);

    if (!res.success) {
      console.error("Failed to persist current organization in DB:", res.error);
    }
  },

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null, currentOrganization: null }),
}));
