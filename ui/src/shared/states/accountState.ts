import IAccount from 'shared/interfaces/IAccount'
import { create } from 'zustand'

type useAccountState = {
  account?: IAccount,
}

export const useAccountState = create<useAccountState>()((set, get) => ({
  account: undefined,
}))