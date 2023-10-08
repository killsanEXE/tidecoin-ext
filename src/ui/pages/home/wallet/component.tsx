import { useNavigate } from "react-router-dom";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import ReceiveIcon from "@/ui/components/icons/ReceiveIcon";
import SendIcon from "@/ui/components/icons/SendIcon";
import s from "./styles.module.scss";
import { copyToClipboard, shortAddress } from "@/ui/utils";
import toast from "react-hot-toast";
import { useWalletState } from "@/ui/states/walletState";
import cn from "classnames";
import { useEffect, useState } from "react";
import {
  useUpdateCurrentAccountBalance,
} from "@/ui/hooks/wallet";
import ReactLoading from "react-loading";
import { ITransaction } from "@/shared/interfaces/apiController";
import { useUpdateCurrentAccountTransactions } from "@/ui/hooks/transactions";

const Wallet = () => {
  const { currentAccount, currentWallet } = useWalletState(
    (v) => ({
      currentAccount: v.currentAccount,
      selectedAccount: v.selectedAccount,
      currentWallet: v.currentWallet,
    })
  );
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [updatedTransactions, setUpdatedTransactions] = useState(false);
  const updateCurrentAccountBalance = useUpdateCurrentAccountBalance();
  const updateCurrentAccountTransactions =
    useUpdateCurrentAccountTransactions();

  const udpateTransactions = async () => {
    const receivedTransactions = await updateCurrentAccountTransactions();
    if (receivedTransactions !== undefined)
      setTransactions(receivedTransactions);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentAccountBalance();
      udpateTransactions();
    }, 10000);

    if (currentAccount() && currentAccount()?.balance === undefined)
      updateCurrentAccountBalance();
    if (!updatedTransactions) {
      udpateTransactions();
      setUpdatedTransactions(true);
    }

    return () => clearInterval(interval);
  }, [updateCurrentAccountBalance, currentAccount(), udpateTransactions, transactions]);

  return (
    <div className={s.walletDiv}>
      <div className={s.changeWalletAccDiv}>
        <button
          onClick={() => {
            navigate("/pages/switch-wallet");
          }}
          className={cn(s.change, s.btn)}
        >
          {currentWallet()?.name ?? "wallet"}
        </button>
        <button
          onClick={() => {
            navigate("/pages/switch-account");
          }}
          className={cn(s.change, s.btn)}
        >
          {currentAccount()?.name}
        </button>
      </div>

      <div className={cn(s.accPanel, s.center)}>
        <div className={cn(s.balance, s.center)}>
          {currentAccount()?.balance === undefined ? (
            <ReactLoading
              type="spin"
              color="#fff"
              width={"2rem"}
              className="react-loading"
            />
          ) : (
            currentAccount()?.balance
          )}{" "}
          TDC
        </div>
        <p
          className={cn(s.accPubAddress, s.center)}
          onClick={() => {
            copyToClipboard(currentAccount()?.address).then(() => {
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
          <CopyIcon /> {shortAddress(currentAccount()?.address)}
        </p>

        <div className={cn(s.receiveSendBtns, s.center)}>
          <button
            onClick={() => {
              navigate("/pages/receive");
            }}
            className={cn(s.btn, s.center)}
          >
            <ReceiveIcon /> Receive
          </button>
          <button
            onClick={() => {
              navigate("/pages/send");
            }}
            className={cn(s.btn, s.center)}
          >
            <SendIcon /> Send
          </button>
        </div>
      </div>

      <p className={s.transactions}>Transactions</p>
      {transactions.length > 0 ?
        <div className={s.transactionsDiv}>
          {transactions.map((t, index) => (
            <div className={s.transaction} key={index}
              onClick={() => { navigate(`/pages/transaction-info/${t.spentTxid}`) }}>
              <p className={s.value}>{t.value / 10 ** 8}</p>
              <p className={s.address}>{shortAddress(t.address)}</p>
            </div>
          ))}
        </div>
        :
        <p className={s.noTransactions}>No transactions</p>}
    </div>
  );
};

export default Wallet;
