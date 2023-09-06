import Account from 'shared/interfaces/IAccount'
import { create } from 'zustand'

type useAccountState = {
  account?: Account,
}

export const useAccountState = create<useAccountState>()((set) => ({
  account: undefined,
}))