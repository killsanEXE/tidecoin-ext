import { useCallback } from "react";
import { useGetCurrentAccount, useGetCurrentWallet, useWalletState } from "../states/walletState";
import { useControllersState } from "../states/controllerState";
import { tidoshisToAmount } from "../utils";
import { Psbt } from "tidecoinjs-lib";
import { Hex } from "@/background/services/keyring/types";

export function useCreateTidecoinTxCallback() {
  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();
  const { selectedAccount, selectedWallet } = useWalletState((v) => ({
    selectedAccount: v.selectedAccount,
    selectedWallet: v.selectedWallet,
  }));
  const { apiController, keyringController } = useControllersState((v) => ({
    apiController: v.apiController,
    keyringController: v.keyringController,
  }));

  return useCallback(
    async (toAddress: Hex, toAmount: number, feeRate: number, receiverToPayFee = false) => {
      if (selectedWallet === undefined || selectedAccount === undefined)
        throw new Error("Failed to get current wallet or account");
      const fromAddress = currentAccount?.address;
      const utxos = await apiController.getUtxos(fromAddress!);
      const safeBalance = (utxos ?? []).reduce((pre, cur) => pre + cur.value, 0);
      if (safeBalance < toAmount) {
        throw new Error(
          `Insufficient balance. Non-Inscription balance (${tidoshisToAmount(
            safeBalance
          )} TDC) is lower than ${tidoshisToAmount(toAmount)} TDC `
        );
      }

      const psbtHex = await keyringController.sendTDC({
        to: toAddress,
        amount: toAmount,
        utxos: utxos!,
        receiverToPayFee,
        feeRate: feeRate,
      });
      const psbt = Psbt.fromHex(psbtHex);
      const rawtx = psbt.extractTransaction().toHex();
      return rawtx;
    },
    [currentWallet, apiController, currentAccount, selectedAccount, selectedWallet, keyringController]
  );
}

export function usePushTidecoinTxCallback() {
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));

  return useCallback(
    async (rawtx: string) => {
      try {
        const txid = await apiController.pushTx(rawtx);
        return txid;
      } catch (e) {
        console.error(e);
      }
    },
    [apiController]
  );
}

export function useUpdateCurrentAccountTransactions() {
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));
  const currentAccount = useGetCurrentAccount();

  return useCallback(async () => {
    return await apiController.getTransactions(currentAccount!.address ?? "");
  }, [currentAccount]);
}
