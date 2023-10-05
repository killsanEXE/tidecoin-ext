import { IWallet } from "@/shared/interfaces";
import { useAppState } from "../states/appState";
import { useControllersState } from "../states/controllerState";
import { useWalletState } from "../states/walletState";

export const useSaveWallets = () => {
  const { password } = useAppState((v) => ({ password: v.password }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return async (wallets: IWallet[]) => {
    await walletController.saveWallets(password!, wallets);
  };
};

export const useCreateNewWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const saveWallets = useSaveWallets();

  return async (phrase: string, name?: string) => {
    const wallet = await walletController.createNewWallet(
      wallets,
      phrase,
      name
    );
    wallet.currentAccount = wallet.accounts[0];
    wallets.push(wallet);
    await saveWallets(wallets);
    updateWalletState({
      currentWallet: wallet,
      wallets,
    });
  };
};

export const useUpdateCurrentWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));

  return (wallet: Partial<IWallet>) => {
    const oldWallet = wallets.find((f) => f.id === wallet.id);
    if (wallet.id === undefined || !oldWallet) return {};
    wallets[wallet.id] = { ...oldWallet, ...wallet } as IWallet;
    updateWalletState({
      wallets,
      currentWallet: wallets.find((f) => f.id === wallet.id),
    });
  };
};

export const useCreateNewAccount = () => {
  const updateCurrentWallet = useUpdateCurrentWallet();
  const { currentWallet, wallets } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
    wallets: v.wallets,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const saveWallets = useSaveWallets();

  return async (name?: string) => {
    if (!currentWallet) return;
    const createdAccount = await walletController.createNewAccount(
      currentWallet,
      name
    );
    const updatedWallet: IWallet = {
      ...currentWallet,
      accounts: [...currentWallet.accounts, createdAccount],
      currentAccount: createdAccount,
    };

    updateCurrentWallet(updatedWallet);
    await saveWallets(wallets);
  };
};

export const useSwitchWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return async (id: number, key: number) => {
    const wallet = wallets.find((f) => f.id === key);
    if (!wallet || wallet.id !== id) return;
    if (!wallet.accounts[0].address) {
      wallet.accounts = await walletController.loadAccountsData(wallet);
    }
    wallet.currentAccount = wallet.accounts[0];
    wallets[key] = wallet;
    updateWalletState({ currentWallet: wallet, wallets: wallets });
  };
};

export const useUpdateCurrentAccountBalance = () => {
  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }));
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));
  const updateCurrentWallet = useUpdateCurrentWallet();

  return async () => {
    const balance = await apiController.getAccountBalance(
      currentWallet?.currentAccount?.address ?? ""
    );
    if (balance === undefined || !currentWallet?.currentAccount) return;
    updateCurrentWallet({
      ...currentWallet,
      currentAccount: {
        ...currentWallet?.currentAccount,
        balance: balance / 10 ** 8,
      },
    });
  };
};
