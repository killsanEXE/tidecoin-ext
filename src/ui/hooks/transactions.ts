import { useCallback } from "react";
import { useWalletState } from "../states/walletState";
import { useControllersState } from "../states/controllerState";
import { tidoshisToAmount } from "../utils";
import { Psbt } from "tidecoinjs-lib";
import { Hex } from "@/background/services/keyring/types";

export function useCreateBitcoinTxCallback() {
  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }));
  const { apiController, keyringController } = useControllersState((v) => ({
    apiController: v.apiController,
    keyringController: v.keyringController,
  }));

  if (!currentWallet || !currentWallet?.currentAccount)
    throw new Error("Failed to get current wallet or account");

  const fromAddress = currentWallet.currentAccount?.address;

  return useCallback(
    async (
      toAddress: Hex,
      toAmount: number,
      feeRate: number,
      receiverToPayFee = false
    ) => {
      const utxos = await apiController.getUtxos(fromAddress!);
      const safeBalance = (utxos ?? []).reduce(
        (pre, cur) => pre + cur.value,
        0
      );
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
    [currentWallet, apiController]
  );
}

export function usePushBitcoinTxCallback() {
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
