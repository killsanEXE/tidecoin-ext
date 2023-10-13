import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import QRCode from "qr-code-styling";
import s from "./styles.module.scss";
import cn from "classnames";
import { copyToClipboard } from "@/ui/utils";
import toast from "react-hot-toast";

const qrCode = new QRCode({
  width: 200,
  height: 200,
  type: "canvas",
  image: "https://svgshare.com/i/yUC.svg",
  dotsOptions: {
    color: "#323651",
    type: "extra-rounded",
  },
  backgroundOptions: {
    color: "#f8f7ff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
});

const Receive = () => {
  const currentAccount = useGetCurrentAccount();
  const ref = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    qrCode.append(ref.current!);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: currentAccount?.address,
    });
  }, [currentAccount?.address]);

  useEffect(() => {
    if (currentAccount === undefined) navigate("/home/wallet");
  }, [currentAccount, navigate]);

  return (
    <div className={s.receive}>
      <div className="flex items-center flex-col">
        <div className="p-3 rounded-xl mb-2">
          <div ref={ref} />
        </div>
        <p className="text-center mb-2 opacity-80">{currentAccount?.address}</p>
      </div>
      <div className={s.accTitle}>{currentAccount?.name ?? "Account"}</div>
      <button
        className={cn("btn primary", s.copyButton)}
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
