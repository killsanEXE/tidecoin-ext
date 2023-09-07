import IAccount from 'shared/interfaces/IAccount'
import IWallet from 'shared/interfaces/IWallet';
import { create } from 'zustand'

export const useWalletState = create<IWallet>()((set, get) => ({
    wallets: [],
    loadPhraseHash: async () => { },
    createNewAccount: async () => { },
    createNewWallet: async () => { },
    updateWallets: (wallet: Partial<IWallet>) => { set(wallet) }
}))