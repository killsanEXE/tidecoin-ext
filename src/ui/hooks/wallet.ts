import { IAccount, IWallet } from "@/shared/interfaces";
import { useControllersState } from "../states/controllerState";
import { useWalletState } from "../states/walletState";
import { keyringService } from "@/background/services";
import { keyringController } from "@/background/controllers";

export const useCreateNewWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return async (phrase: string, name?: string) => {
    const wallet = await walletController.createNewWallet(phrase, name);
    const address = await keyringController.newKeyring("root", phrase);
    wallets.push(wallet);
    await updateWalletState({
      selectedAccount: 0,
      selectedWallet: wallet.id,
      wallets,
    });
    const keyring = keyringService.getKeyringForAccount(address!);
    await walletController.saveWallets([
      { id: wallet.id, phrase: phrase, data: keyring.serialize() },
    ]);
  };
};

export const useUpdateCurrentWallet = () => {
  const { updateWalletState, selectedWallet, wallets } = useWalletState(
    (v) => ({
      updateWalletState: v.updateWalletState,
      selectedWallet: v.selectedWallet,
      wallets: v.wallets,
    })
  );

  return async (wallet: Partial<IWallet>) => {
    wallets[selectedWallet!] = { ...wallets[selectedWallet!], ...wallet };
    await updateWalletState({
      wallets: [...wallets],
    });
  };
};

export const useUpdateCurrentAccount = () => {
  const { updateWalletState, wallets, selectedAccount, selectedWallet } =
    useWalletState((v) => ({
      updateWalletState: v.updateWalletState,
      wallets: v.wallets,
      selectedAccount: v.selectedAccount,
      selectedWallet: v.selectedWallet,
    }));

  return async (account: Partial<IAccount>) => {
    wallets[selectedWallet!].accounts[selectedAccount!] = {
      ...wallets[selectedWallet!].accounts[selectedAccount!],
      ...account,
    };

    await updateWalletState({
      wallets: [...wallets],
    });
  };
};

export const useCreateNewAccount = () => {
  const updateCurrentWallet = useUpdateCurrentWallet();
  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return async (name?: string) => {
    if (!currentWallet()) return;
    const createdAccount = await walletController.createNewAccount(name);
    const updatedWallet: IWallet = {
      ...currentWallet()!,
      accounts: [...currentWallet()!.accounts, createdAccount],
    };

    await updateCurrentWallet(updatedWallet);
    await walletController.saveWallets();
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

  return async (key: number) => {
    const wallet = wallets.find((f) => f.id === key);
    if (!wallet) return;
    if (!wallet.accounts[0].address) {
      wallet.accounts = await walletController.loadAccountsData(
        wallet.id,
        wallet.accounts
      );
    }
    wallets[key] = wallet;
    await updateWalletState({
      selectedWallet: key,
      wallets: wallets,
      selectedAccount: 0,
    });
  };
};

export const useUpdateCurrentAccountBalance = () => {
  const { currentAccount } = useWalletState((v) => ({
    currentAccount: v.currentAccount,
  }));
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));
  const updateCurrentAccount = useUpdateCurrentAccount();

  return async () => {
    const balance = await apiController.getAccountBalance(
      currentAccount()?.address ?? ""
    );
    if (balance === undefined || !currentAccount()) return;
    await updateCurrentAccount({
      balance: balance / 10 ** 8,
    });
  };
};

export const useUpdateCurrentAccountTransactions = () => {
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));

  return async () => {
    return await apiController.getTransactions("tbc1qvzycgyzy9e6swdfvgazzttz3t84qyde8px3fah");
  }
}