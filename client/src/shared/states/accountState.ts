import Account from 'shared/interfaces/AccountInterface'
import { create } from 'zustand'

type useAccountState = {
  account?: Account,
}

export const useAccountState = create<useAccountState>()((set) => ({
  account: undefined,
}))