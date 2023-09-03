import { create } from 'zustand'

export interface Account{
}

type AccountStore = {
  account: Account,
  update: (account: Partial<Account>) => void
}

export const accountStore = create<AccountStore>()((set) => ({
  account: {},
  update: (account: Partial<Record<keyof Account, any>>) => {
    set({account: Object.assign(accountStore.getState().account, account as Account)})
  }
}))