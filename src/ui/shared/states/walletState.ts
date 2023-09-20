import { create } from 'zustand';
import { IWalletState, IWallet } from '../interfaces/IWallet';

export const useWalletState = create<IWalletState>()((set, get) => ({
    wallets: [],
    vaultWallets: [],
    controller: {} as any,
    updateWalletState: (state: Partial<IWalletState>) => { set(state) },
}))