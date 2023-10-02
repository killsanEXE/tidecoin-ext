import { IWalletState, IWallet } from "@/shared/interfaces";
import { create } from "zustand";

export const useWalletState = create<IWalletState>()((set) => ({
  wallets: new Map<number, IWallet>(),
  vaultIsEmpty: true,
  updateWalletState: (state: Partial<IWalletState>) => { set(state) },
}));
