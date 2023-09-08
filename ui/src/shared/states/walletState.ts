import IAccount from 'shared/interfaces/IAccount'
import IWallet from 'shared/interfaces/IWallet';
import { create } from 'zustand'
import { generate } from 'test-test-test-hd-wallet'

export const useWalletState = create<IWallet>()((set, get) => ({
    wallets: [],
    createNewWallet: () => {
        const privateWallet = generate();
    },
    createNewAccount: async () => { },
    updateWallets: (wallet: Partial<IWallet>) => { set(wallet) }
}))