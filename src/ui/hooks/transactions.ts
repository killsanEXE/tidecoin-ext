import { useCallback } from "react";
import { useWalletState } from "../states/walletState";
import { useControllersState } from "../states/controllerState";
import { tidoshisToAmount } from "../utils";
import { Psbt } from "tidecoinjs-lib";

export function useCreateBitcoinTxCallback() {
  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }));
  const { apiController } = useControllersState((v) => ({
    apiController: v.apiController,
  }));

  if (!currentWallet || !currentWallet?.currentAccount)
    throw new Error("Failed to get current wallet or account");

  const fromAddress = currentWallet.currentAccount?.address;

  return useCallback(
    async (
      toAddressInfo: ToAddressInfo,
      toAmount: number,
      feeRate?: number,
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

      if (!feeRate) {
        const summary = await currentWallet.getFeeSummary();
        feeRate = summary.list[1].feeRate;
      }
      const psbtHex = await wallet.sendBTC({
        to: toAddressInfo.address,
        amount: toAmount,
        utxos,
        receiverToPayFee,
        feeRate,
      });
      const psbt = Psbt.fromHex(psbtHex);
      const rawtx = psbt.extractTransaction().toHex();
      const fee = psbt.getFee();
      dispatch(
        transactionsActions.updateBitcoinTx({
          rawtx,
          psbtHex,
          fromAddress,
          feeRate,
        })
      );
      const rawTxInfo: RawTxInfo = {
        psbtHex,
        rawtx,
        toAddressInfo,
        fee,
      };
      return rawTxInfo;
    },
    [currentWallet, apiController]
  );
}

export function usePushBitcoinTxCallback() {
  const dispatch = useAppDispatch();
  const wallet = useWallet();
  const tools = useTools();
  return useCallback(
    async (rawtx: string) => {
      const ret = {
        success: false,
        txid: "",
        error: "",
      };
      try {
        tools.showLoading(true);
        const txid = await wallet.pushTx(rawtx);
        await sleep(3); // Wait for transaction synchronization
        tools.showLoading(false);
        dispatch(transactionsActions.updateBitcoinTx({ txid }));
        dispatch(accountActions.expireBalance());
        setTimeout(() => {
          dispatch(accountActions.expireBalance());
        }, 2000);
        setTimeout(() => {
          dispatch(accountActions.expireBalance());
        }, 5000);

        ret.success = true;
        ret.txid = txid;
      } catch (e) {
        ret.error = (e as Error).message;
        tools.showLoading(false);
      }

      return ret;
    },
    [dispatch, wallet]
  );
}
