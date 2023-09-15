import { create } from 'zustand'
import { browserStorageLocalGet, browserStorageLocalSet } from '../../../shared/utils/browser'
import IApp from '../interfaces/IApp';
import { IWallet } from '../interfaces/IWallet';
const passworder = require("browser-passworder");

export const useAppState = create<IApp>()((set, get) => ({
    isReady: false,
    isUnlocked: false,
    vault: [],
    password: undefined,
    updateAppState: async (app: Partial<IApp>) => {
        set(app);
    },
    checkVault: async () => {
        if (get().vault.length > 0) return;
        let result = localStorage.getItem("vault");
        let accounts = result === null ? undefined : JSON.parse(result);
        if (accounts === undefined) set({ vault: [] })
        else set({ vault: accounts })
        set({ isReady: true })
    },
    saveAppState: async (wallets: IWallet[]) => {
        if (get().password) {
            let vaultWallets = [];
            for (let acc of wallets) {
                // vaultWallets.push(await passworder.encrypt(get().password, JSON.stringify(acc)));
            }
            // await browserStorageLocalSet(vaultAccounts);
            localStorage.setItem("vault", JSON.stringify(vaultWallets));
        }
    }
}))