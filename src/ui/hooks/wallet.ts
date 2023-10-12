import { IAccount, IWallet } from "@/shared/interfaces";
import { useControllersState } from "../states/controllerState";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
  useWalletState,
} from "../states/walletState";
import { useCallback } from "react";
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";

export const useCreateNewWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));
  const { walletController, keyringController } = useControllersState((v) => ({
    walletController: v.walletController,
    keyringController: v.keyringController
  }));

  return useCallback(
    async (phrase: string, walletType: "simple" | "root", addressType?: AddressType, name?: string) => {
      const wallet = await walletController.createNewWallet(phrase, walletType, addressType, name);
      await updateWalletState({
        selectedAccount: 0,
        selectedWallet: wallet.id,
        wallets: [...wallets, wallet],
      });
      const keyring = await keyringController.serializeKeyringById(wallet.id);
      await walletController.saveWallets([
        { id: wallet.id, phrase: phrase, data: keyring },
      ]);
    },
    [wallets, updateWalletState, walletController]
  );
};

export const useUpdateCurrentWallet = () => {
  const { updateWalletState, selectedWallet, wallets } = useWalletState(
    (v) => ({
      updateWalletState: v.updateWalletState,
      selectedWallet: v.selectedWallet,
      wallets: v.wallets,
    })
  );

  return useCallback(
    async (wallet: Partial<IWallet>) => {
      wallets[selectedWallet!] = { ...wallets[selectedWallet!], ...wallet };
      await updateWalletState({
        wallets: [...wallets],
      });
    },
    [updateWalletState, selectedWallet, wallets]
  );
};

export const useUpdateCurrentAccount = () => {
  const { updateWalletState, wallets, selectedAccount, selectedWallet } =
    useWalletState((v) => ({
      updateWalletState: v.updateWalletState,
      wallets: v.wallets,
      selectedAccount: v.selectedAccount,
      selectedWallet: v.selectedWallet,
    }));

  return useCallback(
    async (account: Partial<IAccount>) => {
      wallets[selectedWallet!].accounts[selectedAccount!] = {
        ...wallets[selectedWallet!].accounts[selectedAccount!],
        ...account,
      };

      await updateWalletState({
        wallets: [...wallets],
      });
    },
    [
      updateWalletState,
      wallets[selectedWallet!].accounts[selectedAccount!],
      selectedAccount,
      selectedWallet,
    ]
  );
};

export const useCreateNewAccount = () => {
  const updateCurrentWallet = useUpdateCurrentWallet();
  const currentWallet = useGetCurrentWallet();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return useCallback(
    async (name?: string) => {
      if (!currentWallet) return;
      const createdAccount = await walletController.createNewAccount(name);
      const updatedWallet: IWallet = {
        ...currentWallet!,
        accounts: [...currentWallet!.accounts, createdAccount],
      };

      await updateCurrentWallet(updatedWallet);
      await walletController.saveWallets();
    },
    [currentWallet, updateCurrentWallet, walletController]
  );
};

export const useSwitchWallet = () => {
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return useCallback(
    async (key: number) => {
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
        selectedWallet: wallet.id,
        wallets: wallets,
        selectedAccount: 0,
      });
    },
    [wallets, updateWalletState, walletController]
  );
};

export const useUpdateCurrentAccountBalance = () => {
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));
  const updateCurrentAccount = useUpdateCurrentAccount();
  const currentAccount = useGetCurrentAccount();

  return useCallback(async (address?: string) => {
    const balance = await apiController.getAccountBalance(
      address ? address : currentAccount?.address ?? ""
    );
    if (balance === undefined || !currentAccount) return;
    await updateCurrentAccount({
      balance: balance / 10 ** 8,
    });
  }, [updateCurrentAccount, currentAccount, apiController]);
};

export const useUpdateCurrentAccountTransactions = () => {
  const { apiController, keyringController } = useControllersState((v) => ({
    apiController: v.apiController,
    keyringController: v.keyringController,
  }));
  const currentAccount = useGetCurrentAccount();

  return useCallback(async () => {
    if (!currentAccount?.address) return;
    return await apiController.getTransactions(currentAccount.address);
  }, [currentAccount, apiController, keyringController]);
};
