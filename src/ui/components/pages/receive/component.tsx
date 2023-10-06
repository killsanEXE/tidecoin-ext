import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import cn from "classnames";

const Receive = () => {
  const { currentAccount, selectedAccount } = useWalletState((v) => ({
    currentAccount: v.currentAccount,
    selectedAccount: v.selectedAccount,
  }));

  const navigate = useNavigate();

  const curAcc = currentAccount();

  useEffect(() => {
    if (curAcc === undefined) navigate("/home/wallet");
  }, [selectedAccount, navigate]);

  return (
    <div className={s.receive}>
      <QRCode value={curAcc!.address ?? ""} />
      <div className={s.accTitle}>{curAcc!.name ?? "Account"}</div>
      <button className={cn("btn", "primary", s.copyButton)}>
        <CopyIcon /> Copy address
      </button>
    </div>
  );
};

export default Receive;
