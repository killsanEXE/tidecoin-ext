import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import CopyIcon from "../../icons/CopyIcon";
import cn from "classnames";

const SwitchWallet = () => {

  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets
  }))


  return (
    <div className={s.receive}>

    </div >
  );
};

export default SwitchWallet;
