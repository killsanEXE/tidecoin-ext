import { create } from 'zustand'
import { browserStorageLocalGet, browserStorageLocalSet } from '../../helpers/browser'
import Account from 'shared/interfaces/AccountInterface';
import App from 'shared/interfaces/AppInterface';

const passworder = require("browser-passworder")

export const useAppState = create<App>()((set, get) => ({
    isReady: false,
    isUnlocked: false,
    exportedAccounts: [],
    vaultAccounts: [],
    password: undefined,
    updateVaultAccount: async (account: Partial<Record<keyof Account, any>>) => {
        let accounts = get().exportedAccounts;
        let foundAccount = accounts.find(f => f.address === account.address);
        if (foundAccount) {
            let index = accounts.indexOf(foundAccount);
            Object.assign(foundAccount, account as Account);
            accounts[index] = foundAccount;
            set({ exportedAccounts: accounts })
            await get().saveAppState();
        }
    },
    updateAppState: async (app: Partial<Record<keyof App, any>>) => {
        let appState = get();
        Object.assign(appState, app as App);
        set(appState);
    },
    checkVault: async () => {
        let accounts = JSON.parse(localStorage.getItem("vaultAccounts") ?? "{}") === "{}" ? undefined : JSON.parse(localStorage.getItem("vaultAccounts") ?? "{}")
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
        let account: Account = {
            type: "string",
            pubkey: "string",
            address: "string",
            key: "string",
        }
        set({ exportedAccounts: [...get().exportedAccounts, account] });
        await get().saveAppState();
    }
}))