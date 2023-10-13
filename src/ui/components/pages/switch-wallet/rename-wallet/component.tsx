import { IWallet } from "@/shared/interfaces";
import { useControllersState } from "@/ui/states/controllerState";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import { useWalletState } from "@/ui/states/walletState";
import Rename from "@/ui/components/rename";
import ReactLoading from "react-loading";
// import cn from "classnames";

const RenameWallet = () => {
  const { walletId } = useParams();
  const [wallet, setWallet] = useState<IWallet | undefined>(undefined);
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const navigate = useNavigate();
  const { wallets, updateWalletState } = useWalletState((v) => ({
    wallets: v.wallets,
    updateWalletState: v.updateWalletState,
  }));

  const renameWallet = async (renamedName: string) => {
    wallets[Number(walletId!)].name = renamedName;
    await updateWalletState({ wallets });
    await walletController.saveWallets();
    navigate(-1);
  };

  useEffect(() => {
    if (!wallet) {
      setWallet(wallets.find((f) => f.id === Number(walletId)));
    }
  }, [setWallet, wallets, walletId]);

  return (
    <div className={s.renameWallet}>
      {wallet ? (
        <Rename
          handler={renameWallet}
          otherNames={wallets.map((f) => f.name)}
          oldName={wallet.name}
        />
      ) : (
        <ReactLoading type="spin" color="#ffbc42" />
      )}
    </div>
  );
};

export default RenameWallet;
