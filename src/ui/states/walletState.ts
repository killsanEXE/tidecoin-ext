import { IWalletState } from "@/shared/interfaces";
import { create } from "zustand";
import { setupStateProxy } from "../utils/setup";

export const useWalletState = create<IWalletState>()((set, get) => ({
  wallets: [],
  vaultIsEmpty: true,
  selectedAccount: undefined,
  selectedWallet: undefined,

  updateWalletState: async (state: Partial<IWalletState>) => {
    const proxy = setupStateProxy();
    await proxy.updateWalletState(state);
    set(state);
  },

  currentWallet: () => {
    const { wallets, selectedAccount } = get();
    const idx = selectedAccount!;
    if (idx === undefined) return undefined;
    return wallets[idx];
  },

  currentAccount: () => {
    const { selectedWallet, selectedAccount, wallets } = get();
    if (selectedWallet === undefined || selectedAccount === undefined)
      return undefined;
    return wallets[selectedWallet].accounts[selectedAccount];
  },
}));
