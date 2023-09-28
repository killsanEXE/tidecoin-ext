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
        wallets: new Map(wallets.entries()),
        currentWallet: wallets.get(wallet.id)
      }
    })
  },
  updateWalletState: (state: Partial<IWalletState>) => {
    set(state);
  },
  createNewWallet: async (password: string, phrase: string, name?: string) => {
    const { wallets, controller } = get();
    const wallet = await controller.createNewWallet(Array.from(wallets.values()), phrase, name);
    wallet.currentAccount = wallet.accounts[0];
    wallets.set(wallet.id, wallet)
    await controller.saveWallets(password, Array.from(wallets.values()))
    set({
      currentWallet: wallet, wallets
    })
  },
  createNewAccount: async (password: string, name?: string) => {
    const { currentWallet, controller, updateCurrentWallet } = get()
    if (!currentWallet) return;
    let createdAccount = await controller.createNewAccount(currentWallet, name);
    createdAccount = {
      ...createdAccount, ...(await controller.loadAccountData(currentWallet.accounts[-1] !== undefined ?
        currentWallet.accounts[-1] : currentWallet.accounts[0]))
    }
    const updatedWallet: IWallet = {
      ...currentWallet,
      accounts: [...currentWallet.accounts, createdAccount],
      currentAccount: createdAccount,
    };

    updateCurrentWallet(updatedWallet);
    await controller.saveWallets(password, Array.from(get().wallets.values()));
  }
}));
