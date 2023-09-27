import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import QRCode from "react-qr-code";


const Receive = () => {

  const { currentWallet } = useWalletState((v) => ({
    currentWallet: v.currentWallet
  }))

  const navigate = useNavigate();

  useEffect(() => {
    if (currentWallet === undefined)
      navigate("/home/wallet");
  })

  return (
    <div>
      <QRCode value={currentWallet?.currentAccount.address ?? ""} />
    </div>
  );
};

export default Receive;
