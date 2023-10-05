import { create } from "zustand";
import { setupStateProxy } from "../utils/setup";
import { IAppState } from "@/shared/interfaces";

// const updateState = (config) => (set, get, api) => config((...args) => {
//   console.log(config())
//   // return new Proxy({}, {
//   //   get: (target, key) => {
//   //     if (key === '')
//   //   }
//   // })
//   const proxy = setupStateProxy();

//   console.log(args)
//   proxy.updateAppState({})
//   set(...args)
// }, get, api)

export const useAppState = create<IAppState>()((set) => ({
  isReady: false,
  isUnlocked: false,
  vault: [],
  password: undefined,
  updateAppState: async (app: Partial<IAppState>) => {
    const proxy = setupStateProxy();
    proxy.updateAppState(app);
    set(app);
  },
  logout: () => {
    const proxy = setupStateProxy();
    proxy.updateAppState({ password: undefined, isUnlocked: false });
    set({ password: undefined, isUnlocked: false });
  },
}));


// export const useAppState = create<IAppState>(updateState((set) => ({
//   isReady: false,
//   isUnlocked: false,
//   vault: [],
//   password: undefined,
//   updateAppState: async (app: Partial<IAppState>) => {
//     const proxy = setupStateProxy();
//     proxy.updateAppState
//     set(app);
//   },
//   logout: () => {
//     set({ password: undefined, isUnlocked: false });
//   },
// })));
