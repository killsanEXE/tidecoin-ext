import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import CheckPassword from "../../../check-password";
import { useParams } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";

const ShowPk = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { accId } = useParams();
  const { currentWallet } = useWalletState((v) => ({ currentWallet: v.currentWallet }))
  const { keyringController } = useControllersState((v) => ({ keyringController: v.keyringController }))
  const [secret, setSecret] = useState("");

  useEffect(() => {
    const load = async () => {
      setSecret(await keyringController.exportAccount(currentWallet?.accounts.find(f => f.id === Number(accId))?.address ?? ""))
    }

    load();
  }, [setSecret, keyringController, currentWallet, accId])

  return (
    <div className={s.showPk}>
      {unlocked ?
        <div>{secret}</div>
        : <CheckPassword handler={() => { setUnlocked(true) }} />}
    </div >
  )
}

export default ShowPk