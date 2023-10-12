import { useNavigate } from "react-router-dom";

import {
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
} from "@heroicons/react/24/outline";
import s from "./styles.module.scss";
import { copyToClipboard, shortAddress } from "@/ui/utils";
import toast from "react-hot-toast";
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

  useEffect(() => {
    updateAccountBalance();
    udpateTransactions();
  }, []);

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

      <div className={cn(s.accPanel, s.center)}>
        <div className={cn(s.balance, s.center)}>
          {currentAccount?.balance === undefined ? (
            <ReactLoading
              type="spin"
              color="#fff"
              width={"2rem"}
              className="react-loading"
            />
          ) : (
            currentAccount?.balance
          )}{" "}
          TDC
        </div>
        <p
          className={cn(s.accPubAddress, s.center)}
          onClick={() => {
            copyToClipboard(currentAccount?.address).then(() => {
              toast.success("Copied", {
                style: { borderRadius: 0 },
                iconTheme: {
                  primary: "#ffbc42",
                  secondary: "#766c7f",
                },
              });
            });
          }}
        >
          <DocumentDuplicateIcon className="w-8 h-8" />{" "}
          {shortAddress(currentAccount?.address)}
        </p>

        <div className={cn(s.receiveSendBtns, s.center)}>
          <button
            onClick={() => {
              navigate("/pages/receive");
            }}
            className={cn(s.btn, s.center)}
          >
            <ArrowDownTrayIcon className="w-8 h-8" /> Receive
          </button>
          <button
            onClick={() => {
              navigate("/pages/send");
            }}
            className={cn(s.btn, s.center)}
          >
            <ArrowUpTrayIcon className="w-8 h-8" /> Send
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
              <div className={s.transactionInfo}>
                <p className={s.value}>{t.value / 10 ** 8}</p>
                <p className={s.address}>{shortAddress(t.address)}</p>
              </div>
              <div className={cn(s.icon, t.mintIndex ? s.send : s.receive)}>
                {t.mintIndex ? (
                  <ArrowSmallUpIcon className="w-8 h-8" />
                ) : (
                  <ArrowSmallDownIcon className="w-8 h-8" />
                )}
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
