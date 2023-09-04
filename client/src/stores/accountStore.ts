import { create } from 'zustand'

export interface Account{
  type: string;
  pubkey: string;
  address: string;
  brandName?: string;
  alianName?: string;
  displayBrandName?: string;
  index?: number;
  balance?: number;
  key: string;
}

type AccountStore = {
  account?: Account,
  update: (account: Partial<Account>) => void
}

export const accountStore = create<AccountStore>()((set) => ({
  account: undefined,
  update: (account: Partial<Record<keyof Account, any>>) => {
    set({account: Object.assign(accountStore.getState().account!, account as Account)})
  }
}))