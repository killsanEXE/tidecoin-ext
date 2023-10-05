import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import CopyIcon from "../../icons/CopyIcon";
import cn from "classnames";

const Receive = () => {

  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet
  }))

  const navigate = useNavigate();

  useEffect(() => {
    if (currentWallet === undefined)
      navigate("/home/wallet");
  }, [currentWallet, navigate])

  return (
    <div className={s.receive}>
      <QRCode value={currentWallet?.currentAccount!.address ?? ""} />
      <div className={s.accTitle}>{currentWallet?.currentAccount!.name ?? "Account"}</div>
      <button className={cn("btn", "primary", s.copyButton)}><CopyIcon /> Copy address</button>
    </div >
  );
};

export default Receive;
