import { useNavigate } from "react-router-dom";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import ReceiveIcon from "@/ui/components/icons/ReceiveIcon";
import SendIcon from "@/ui/components/icons/SendIcon";
import s from "./styles.module.scss";
import { copyToClipboard, shortAddress } from "@/ui/utils";
import toast from "react-hot-toast";
import { useWalletState } from "@/ui/states/walletState";
import cn from "classnames";
import { useEffect } from "react";
import { useUpdateCurrentAccountBalance } from "@/ui/hooks/wallet";
import ReactLoading from "react-loading";

const Wallet = () => {
  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet,
  }));
  const navigate = useNavigate();

  const updateCurrentAccountBalance = useUpdateCurrentAccountBalance();

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentAccountBalance();
    }, 10000);

    if (
      currentWallet?.currentAccount &&
      currentWallet.currentAccount.balance === undefined
    )
      updateCurrentAccountBalance();
    return () => clearInterval(interval);
  }, [updateCurrentAccountBalance, currentWallet]);

  return (
    <div className={s.walletDiv}>
      <div className={s.changeWalletAccDiv}>
        <button
          onClick={() => {
            navigate("/pages/switch-wallet");
          }}
          className={cn(s.change, s.btn, "bg-primary")}
        >
          {currentWallet?.name ?? "wallet"}
        </button>
        <button
          onClick={() => {
            navigate("/pages/switch-account");
          }}
          className={cn(s.change, s.btn)}
        >
          {currentWallet?.currentAccount.name}
        </button>
      </div>

      <div className={cn(s.accPanel, s.center)}>
        <div className={cn(s.balance, s.center)}>
          {currentWallet?.currentAccount.balance === undefined ? (
            <ReactLoading
              type="spin"
              color="#fff"
              width={"2rem"}
              className="react-loading"
            />
          ) : (
            currentWallet?.currentAccount.balance
          )}{" "}
          TDC
        </div>
        <p
          className={cn(s.accPubAddress, s.center)}
          onClick={() => {
            copyToClipboard(currentWallet?.currentAccount.address).then(() => {
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
          <CopyIcon /> {shortAddress(currentWallet?.currentAccount.address)}
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
    </div>
  );
};

export default Wallet;
