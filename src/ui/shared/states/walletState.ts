import { create } from 'zustand';
import { fromMnemonic } from 'test-test-test-hd-wallet';
import IAccount from '../interfaces/IAccount';
import { IWalletState, IWallet } from '../interfaces/IWallet';
import { toHex } from '../utils';
import Mnemonic from 'test-test-test-hd-wallet/src/hd/mnemonic';

function getNewAccount() {
    return {
        type: "string",
        pubkey: "string",
        address: "string",
        brandName: "ACCOUNT #1",
        alianName: "string",
        displayBrandName: "string",
        index: 0,
        balance: 0,
        key: "string",
    }
}

export const useWalletState = create<IWalletState>()((set, get) => ({
    wallets: [],
    createNewWallet: (name?: string): IWallet[] => {
        const mnemonic = new Mnemonic()
        const privateWallet = fromMnemonic(mnemonic);
        const account = getNewAccount();
        set({
            currentWallet: {
                name: name === undefined ? `Wallet #${get().wallets.length + 1}` : name,
                phrase: mnemonic.getPhrase(),
                accounts: [account],
                currentAccount: account
            }
        });
        set({ wallets: [...get().wallets, get().currentWallet!] })
        return get().wallets;
    },
    createNewAccount: (name?: string): IWallet[] => {
        if (!name || name.length <= 0) name = `Account #${get().currentWallet?.accounts.length! + 1}`
        const currentWallet = get().currentWallet;
        if (!currentWallet) return [];
        const account: IAccount = getNewAccount();
        account.brandName = name;

        set({ currentWallet: { ...currentWallet, accounts: [...currentWallet?.accounts!, account], currentAccount: account } })
        return get().wallets;
    },
    updateWalletState: (state: Partial<IWalletState>) => { set(state) },
    updateCurrentWalletName: (name: string) => {
        const currentWallet = get().currentWallet;
        if (currentWallet) set({ currentWallet: { ...currentWallet, name } })
    }
}))