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
    }
}))