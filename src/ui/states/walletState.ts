import { IWalletState } from "@/shared/interfaces";
import { create } from "zustand";
import { setupStateProxy } from "../utils/setup";

export const useWalletState = create<IWalletState>()((set) => ({
  wallets: [],
  vaultIsEmpty: true,
  updateWalletState: (state: Partial<IWalletState>) => {
    const proxy = setupStateProxy();
    console.log(state)
    proxy.updateWalletState(state);
    set(state)
  },
}));
