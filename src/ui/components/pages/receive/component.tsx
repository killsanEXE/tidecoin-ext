import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import cn from "classnames";

const Receive = () => {
  const currentAccount = useGetCurrentAccount();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentAccount === undefined) navigate("/home/wallet");
  }, [currentAccount, navigate]);

  return (
    <div className={s.receive}>
      <QRCode value={currentAccount!.address ?? ""} />
      <div className={s.accTitle}>{currentAccount!.name ?? "Account"}</div>
      <button className={cn("btn", "primary", s.copyButton)}>
        <CopyIcon /> Copy address
      </button>
    </div>
  );
};

export default Receive;
