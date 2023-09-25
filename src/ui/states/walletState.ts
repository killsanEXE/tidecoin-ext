import { IWalletState, IWallet } from "@/shared/interfaces";
import { create } from "zustand";

export const useWalletState = create<IWalletState>()((set, get) => ({
  wallets: new Map<number, IWallet>(),
  vaultIsEmpty: true,
  controller: {} as any,
  updateCurrentWallet: (wallet: Partial<IWallet>) => {
    set(({ wallets }) => {
      if (wallet.id === undefined || !wallets.has(wallet.id)) return {}
      const old = wallets.get(wallet.id)
      wallets.set(wallet.id, { ...old, ...wallet } as IWallet)
      return {
        wallets,
        currentWallet: wallets.get(wallet.id)
      }
    })
  },
  updateWalletState: (state: Partial<IWalletState>) => {
    set(state);
  },
  createNewWallet: async (password: string) => {
    const { wallets, controller } = get();
    const wallet = await controller.createNewWallet(Array.from(wallets.values()));
    wallet.accounts[0].address = await controller.loadAccountPublicAddress(wallet, wallet.accounts[0]);
    wallet.currentAccount = wallet.accounts[0];
    wallets.set(wallet.id, wallet)
    await controller.saveWallets(password, Array.from(wallets.values()))
    set({
      currentWallet: wallet, wallets
    })
  },
  createNewAccount: async (password: string, name?: string) => {
    const { currentWallet, controller, updateCurrentWallet, wallets } = get()
    if (!currentWallet) return;
    const createdAccount = await controller.createNewAccount(currentWallet, name);
    const updatedWallet: IWallet = {
      ...currentWallet,
      accounts: [ ...currentWallet.accounts, createdAccount ],
      currentAccount: createdAccount,
    };
    updateCurrentWallet(updatedWallet);
    await controller.saveWallets(password, Array.from(wallets.values()));
  }
}));
