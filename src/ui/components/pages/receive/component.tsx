import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import QRCode from "react-qr-code";
import s from "./styles.module.scss";
import cn from "classnames";
import { copyToClipboard } from "@/ui/utils";
import toast from "react-hot-toast";

const Receive = () => {
  const currentAccount = useGetCurrentAccount();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentAccount === undefined) navigate("/home/wallet");
  }, [currentAccount, navigate]);

  return (
    <div className={s.receive}>
      <div className="mb-7">
        <div className="mb-4">
          <QRCode
            bgColor="#0d1b2a"
            fgColor="white"
            value={currentAccount?.address ?? ""}
          />
        </div>
        <p className="text-center mb-2 opacity-80">{currentAccount?.address}</p>
        <div className={s.accTitle}>{currentAccount?.name ?? "Account"}</div>
      </div>
      <button
        className={cn("btn", "primary", s.copyButton)}
        onClick={() => {
          copyToClipboard(currentAccount?.address);
          toast.success("Copied");
        }}
      >
        Copy address
      </button>
    </div>
  );
};

export default Receive;
