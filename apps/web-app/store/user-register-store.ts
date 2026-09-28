import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RegisterState {
  step: number;
  formData: Record<string, any>;
  setStep: (step: number) => void;
  updateFormData: (data: Record<string, any>) => void;
  resetForm: () => void;
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      step: 1,
      formData: {},
      setStep: (step) => set({ step }),
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ step: 1, formData: {} }),
    }),
    {
      name: "servitec-time-register",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
