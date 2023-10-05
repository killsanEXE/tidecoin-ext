import { IWalletState, IWallet } from "@/shared/interfaces";
import { create } from "zustand";
import { setupStateProxy } from "../utils/setup";

export const useWalletState = create<IWalletState>()((set) => ({
  wallets: new Map<number, IWallet>(),
  vaultIsEmpty: true,
  updateWalletState: (state: Partial<IWalletState>) => {
    const proxy = setupStateProxy();
    proxy.updateWalletState(state);
    set(state)
  },
}));
