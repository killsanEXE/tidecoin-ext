import { useState } from "react";
import s from "./styles.module.scss";
import CheckPassword from "../../../check-password";
import { useParams } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";

const ShowPk = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { accId } = useParams();
  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))



  return (
    <div className={s.showPk}>
      {unlocked ?
        <div>{ }</div>
        : <CheckPassword handler={() => { setUnlocked(true) }} />}
    </div >
  )
}

export default ShowPk