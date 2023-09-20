import { create } from 'zustand'
import IApp from '../interfaces/IApp';
import { IWallet } from '../interfaces/IWallet';
import { setupPm } from '@/ui/utils/setup';
import { EVENTS } from '@/shared/constant';
const passworder = require("browser-passworder");

export const useAppState = create<IApp>()((set, get) => ({
    isReady: false,
    isUnlocked: false,
    vault: [],
    password: undefined,
    updateAppState: async (app: Partial<IApp>) => {
        set(app);
    },
    setupApp: async () => {
        console.log("setupapp")
        const portMessageChannel = setupPm();
        await portMessageChannel.request({
            type: "openapi",
            method: "get some_shit",
            params: "params"
        })
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