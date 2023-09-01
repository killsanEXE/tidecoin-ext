import { create } from 'zustand'

export interface User{
  username?: string,
  password?: string,
}

type UserStore = {
  user: User,
  update: (user: Partial<User>) => void
}

export const userStore = create<UserStore>()((set) => ({
  user: {},
  update: (user: Partial<Record<keyof User, any>>) => {
    set({user: Object.assign(userStore.getState().user, user as User)})
  }
}))