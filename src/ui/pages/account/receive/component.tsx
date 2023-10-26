import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import QRCode from "qr-code-styling";
import s from "./styles.module.scss";
import CopyBtn from "@/ui/components/copy-btn";

const qrCode = new QRCode({
  width: 250,
  height: 250,
  type: "canvas",
  image: "/qr.svg",
  dotsOptions: {
    color: "#FDFDFD",
    type: "extra-rounded",
  },
  backgroundOptions: {
    color: "#00000000",
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
    if (currentAccount === undefined) navigate("/home");
  }, [currentAccount, navigate]);

  return (
    <div className={s.receive}>
      <div>
        <div className="flex items-center flex-col p-3">
          <div ref={ref} />
        </div>
        <div className={s.accTitle}>{currentAccount?.name ?? "Account"}</div>
      </div>
      <CopyBtn label="Copy address" value={currentAccount?.address} className={s.copyButton} />
      <p className="text-center opacity-80 text-xs">{currentAccount?.address}</p>
    </div>
  );
};

export default Receive;
