import { create } from 'zustand'
import { Account } from './accountStore'

export interface App{
    isReady: boolean,
    isUnlocked: boolean,
    accounts: Account[],
    password: string | undefined
}

export const appStore = create<App>()((set) => ({
    isReady: false,
    isUnlocked: false,
    accounts: [],
    password: undefined
}))

