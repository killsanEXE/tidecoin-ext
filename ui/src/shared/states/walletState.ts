import { generate } from 'falcon-hd';
import IAccount from 'shared/interfaces/IAccount'
import IWallet from 'shared/interfaces/IWallet';
import { create } from 'zustand'

export const useWalletState = create<IWallet>()((set, get) => ({
    wallets: [],
    createNewWallet: () => {
        const privateWallet = generate();
        console.log(privateWallet.publicKey);
        console.log(privateWallet.privateKey);
    },
    createNewAccount: async () => { },
    updateWallets: (wallet: Partial<IWallet>) => { set(wallet) }
}))