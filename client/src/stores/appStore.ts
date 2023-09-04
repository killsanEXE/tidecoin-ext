import { create } from 'zustand'
import { Account } from './accountStore'
import { browserStorageLocalGet, browserStorageLocalSet } from '../helpers/browser'

export interface App{
    isReady: boolean,
    isUnlocked: boolean,
    exportedAccounts: Account[],
    vaultAccounts: string[],
    password: string | undefined
}

export const appStore = create<App>()((set) => ({
    isReady: false,
    isUnlocked: false,
    exportedAccounts: [],
    vaultAccounts: [],
    password: undefined
}))

const setVaultAccounts = async (val: any) => {
    if(val.vaultAccounts === undefined) await browserStorageLocalSet({vaultAccounts: []})
    else await browserStorageLocalSet({vaultAccounts: val.vaultAccounts})
}

export const updateVaultAccounts = async (accounts: Account[]) => {

}

const saveAppState = () => {
    
}

export const updateVaultAccount = async (account: Partial<Record<keyof Account, any>>) => {
    let accounts = appStore().exportedAccounts;
    let foundAccount = accounts.find(f => f.address === account.address);
    if(foundAccount){
        let index = accounts.indexOf(foundAccount);
        Object.assign(foundAccount, account as Account);
        accounts[index] = foundAccount;
        appStore().exportedAccounts = accounts;
    }
}

export const checkVault = async () => {
    await browserStorageLocalGet(setVaultAccounts);
    appStore().isReady = true;
}