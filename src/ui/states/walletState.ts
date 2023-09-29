import { IWalletState, IWallet, IWalletController } from "@/shared/interfaces";
import { create } from "zustand";

export const useWalletState = create<IWalletState>()((set, get) => ({
  wallets: new Map<number, IWallet>(),
  vaultIsEmpty: true,
  updateWalletState: (state: Partial<IWalletState>) => { set(state) },
}));
