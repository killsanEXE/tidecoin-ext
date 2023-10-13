import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import QRCode from "qr-code-styling";
import s from "./styles.module.scss";
import CopyBtn from "@/ui/components/copy-btn";

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
      <div className="flex items-center flex-col p-3">
        <div ref={ref} />
      </div>
      <div className={s.accTitle}>{currentAccount?.name ?? "Account"}</div>
      <CopyBtn label="Copy address" value={currentAccount?.address} />
      <p className="text-center mb-2 opacity-80 absolute bottom-0 left-1/2 -translate-x-1/2">
        {currentAccount?.address}
      </p>
    </div>
  );
};

export default Receive;
