import { create } from 'zustand';
import { fromMnemonic } from 'test-test-test-hd-wallet';
import Mnemonic from 'test-test-test-hd-wallet/src/hd/mnemonic';
import { IWalletState, IWallet } from 'shared/interfaces/IWallet';
import { toHex } from 'shared/utils';
import IAccount from 'shared/interfaces/IAccount';
import { couldStartTrivia } from 'typescript';

function createNewAccount() {
    return {
        type: "string",
        pubkey: "string",
        address: "string",
        brandName: "string",
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
        const account = createNewAccount();
        set({
            currentWallet: {
                name: name === undefined ? `Wallet №${get().wallets.length + 1}` : name,
                phrase: mnemonic.getPhrase(),
                privateKey: toHex(privateWallet.privateKey),
                publicKey: toHex(privateWallet.publicKey),
                accounts: [account],
                currentAccount: account
            }
        });
        set({ wallets: [...get().wallets, get().currentWallet!] })
        return get().wallets;
    },
    createNewAccount: (): IWallet[] => {
        const currentWallet = get().currentWallet;
        if (!currentWallet) return [];
        const account: IAccount = createNewAccount();

        set({ currentWallet: { ...currentWallet, accounts: [...currentWallet?.accounts!, account] } })
        return get().wallets;
    },
    updateWalletState: (state: Partial<IWalletState>) => { set(state) },
    updateCurrentWalletName: (name: string) => {
        const currentWallet = get().currentWallet;
        if (currentWallet) set({ currentWallet: { ...currentWallet, name } })
    }
}))