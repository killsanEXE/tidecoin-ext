import { create } from 'zustand'
import { browserStorageLocalGet, browserStorageLocalSet } from '../../helpers/browser'
import IApp from 'shared/interfaces/IApp';
import IAccount from 'shared/interfaces/IAccount';

const passworder = require("browser-passworder")

export const useAppState = create<IApp>()((set, get) => ({
    isReady: false,
    isUnlocked: false,
    exportedAccounts: [],
    vaultAccounts: [],
    password: undefined,
    updateAppState: async (app: Partial<IApp>) => {
        set(app);
    },
    checkVault: async () => {
        if(get().vaultAccounts.length > 0) return;
        let result = localStorage.getItem("vaultAccounts");
        let accounts = result === null ? undefined : JSON.parse(result);
        if (accounts === undefined) set({ vaultAccounts: [] })
        else set({ vaultAccounts: accounts })
        set({ isReady: true })
    },
    saveAppState: async () => {
        if (get().password) {
            let vaultAccounts = [];
            for (let acc of get().exportedAccounts) {
                vaultAccounts.push(await passworder.encrypt(get().password, JSON.stringify(acc)));
            }
            // await browserStorageLocalSet(vaultAccounts);
            localStorage.setItem("vaultAccounts", JSON.stringify(vaultAccounts));
        }
    },
    createNewAccount: async () => {
        let account: IAccount = {
            type: "string",
            pubkey: "string",
            address: "string",
            key: "string",
        }
        set({ exportedAccounts: [...get().exportedAccounts, account] });
        await get().saveAppState();
    }
}))