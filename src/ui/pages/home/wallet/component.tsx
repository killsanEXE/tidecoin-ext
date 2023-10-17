import { useNavigate } from "react-router-dom";

import { ListBulletIcon } from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { shortAddress } from "@/ui/utils";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
} from "@/ui/states/walletState";
import cn from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useUpdateCurrentAccountBalance } from "@/ui/hooks/wallet";
import ReactLoading from "react-loading";
import { ITransaction } from "@/shared/interfaces/apiController";
import { useUpdateCurrentAccountTransactions } from "@/ui/hooks/transactions";
import { useDebounceCall } from "@/ui/hooks/debounce";
import CopyBtn from "@/ui/components/copy-btn";

const Wallet = () => {
  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const updateAccountBalance = useUpdateCurrentAccountBalance();
  const updateAccountTransactions = useUpdateCurrentAccountTransactions();

  const udpateTransactions = useCallback(async () => {
    const receivedTransactions = await updateAccountTransactions();
    if (receivedTransactions !== undefined)
      setTransactions(receivedTransactions);
  }, [updateAccountTransactions, setTransactions]);
  const callUpdateTransactions = useDebounceCall(udpateTransactions, 200);

  useEffect(() => {
    const interval = setInterval(() => {
      updateAccountBalance();
      udpateTransactions();
    }, 10000);

    if (currentAccount && currentAccount.balance === undefined)
      updateAccountBalance();

    callUpdateTransactions();

    return () => {
      clearInterval(interval);
    };
  }, [
    udpateTransactions,
    updateAccountBalance,
    currentAccount,
    currentWallet,
    callUpdateTransactions,
  ]);

  return (
    <div className={s.walletDiv}>
      <div className={s.changeWalletAccDiv}>
        <button
          onClick={() => {
            navigate("/pages/switch-wallet");
          }}
          className={cn(s.change, s.btn)}
        >
          {currentWallet?.name ?? "wallet"}
        </button>
        {currentWallet?.type === "root" && (
          <button
            onClick={() => {
              navigate("/pages/switch-account");
            }}
            className={cn(s.change, s.btn)}
          >
            {currentAccount?.name}
          </button>
        )}
      </div>

      <div className={s.accPanel}>
        <div className="flex gap-2">
          <div className={s.balance}>
            {currentAccount?.balance === undefined ? (
              <ReactLoading
                type="spin"
                color="#ffbc42"
                width={"2rem"}
                className="react-loading"
              />
            ) : (
              currentAccount?.balance
            )}{" "}
            TDC
          </div>
          <div className="text-gray-500 text-sm">~0.06$</div>
        </div>
        <div className="flex gap-2 items-center pl-6">
          <ListBulletIcon className={s.accountsIcon} />
          <CopyBtn
            title={currentAccount?.address}
            className={cn(s.accPubAddress)}
            label={shortAddress(currentAccount?.address, 9)}
            value={currentAccount?.address}
          />
        </div>

        <div className={cn(s.receiveSendBtns, s.center)}>
          <button
            onClick={() => {
              navigate("/pages/receive");
            }}
            className={cn(s.btn, s.center, "w-36")}
          >
            Receive
          </button>
          <button
            onClick={() => {
              navigate("/pages/create-send");
            }}
            className={cn(s.btn, s.center, "w-36")}
          >
            Send
          </button>
        </div>
      </div>

      <p className={s.transactions}>Transactions</p>
      {transactions.length > 0 ? (
        <div className={s.transactionsDiv}>
          {transactions.map((t, index) => (
            <div
              className={s.transaction}
              key={index}
              onClick={() => {
                navigate(`/pages/transaction-info/${t.mintTxid}`);
              }}
            >
              <div className="flex gap-2 items-center">
                <div className="rounded-full bg-gray-300 w-6 h-6 text-bg flex items-center justify-center">
                  T
                </div>
                <div className={s.transactionInfo}>
                  <div className={s.address}>{shortAddress(t.mintTxid)}</div>
                </div>
              </div>
              <div
                className={cn(s.value, {
                  "text-green-500": !t.mintIndex,
                  "text-red-500": t.mintIndex,
                })}
              >
                {t.mintIndex ? "- " : "+ "}
                {t.value / 10 ** 8} TDC
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={s.noTransactions}>No transactions</p>
      )}
    </div>
  );
};

export default Wallet;
