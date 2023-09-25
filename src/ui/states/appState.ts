import { IApp } from "@/shared/interfaces";
import { create } from "zustand";

export const useAppState = create<IApp>()((set) => ({
  isReady: false,
  isUnlocked: false,
  vault: [],
  password: undefined,
  updateAppState: async (app: Partial<IApp>) => {
    set(app);
  },
}));
