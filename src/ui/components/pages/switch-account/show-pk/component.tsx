import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import CheckPassword from "../../../check-password";
import { useParams } from "react-router-dom";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";
import { copyToClipboard } from "@/ui/utils";
import cn from "classnames";
import CopyIcon from "@/ui/components/icons/CopyIcon";
import toast from "react-hot-toast";

const ShowPk = () => {
  const [unlocked, setUnlocked] = useState(false);
  const { accId } = useParams();
  const currentAccount = useGetCurrentAccount();
  const { keyringController } = useControllersState((v) => ({
    keyringController: v.keyringController,
  }));
  const [secret, setSecret] = useState("");

  useEffect(() => {
    const load = async () => {
      setSecret(
        await keyringController.exportAccount(currentAccount?.address ?? "")
      );
    };

    load();
  }, [setSecret, keyringController, currentAccount, accId]);

  return (
    <div className={s.showPk}>
      {unlocked ? (
        <div className={s.showPkDiv}>
          <button className={cn("btn", s.copySecret)} onClick={() => {
            copyToClipboard(secret);
            toast.success("Copied")
          }}><CopyIcon /> Copy</button>
          <div className={s.secret}>{secret}</div>
        </div>
      ) : (
        <CheckPassword
          handler={() => {
            setUnlocked(true);
          }}
        />
      )}
    </div>
  );
};

export default ShowPk;
