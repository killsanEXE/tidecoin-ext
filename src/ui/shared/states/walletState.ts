import { create } from 'zustand';
import { IWalletState, IWallet } from '../interfaces/IWallet';

export const useWalletState = create<IWalletState>()((set, get) => ({
    wallets: [],
    vaultWallets: [],
    controller: {},
    updateWalletState: (state: Partial<IWalletState>) => { set(state) },
}))