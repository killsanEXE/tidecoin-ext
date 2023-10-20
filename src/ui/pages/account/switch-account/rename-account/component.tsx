import { useNavigate, useParams } from "react-router-dom";
import s from "./styles.module.scss";
import { useCallback } from "react";
import { useGetCurrentWallet } from "@/ui/states/walletState";
import Rename from "@/ui/components/rename";
import { useUpdateCurrentWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";

const RenameAccount = () => {
  const { accId } = useParams();
  const currentWallet = useGetCurrentWallet();
  const updateCurrentWallet = useUpdateCurrentWallet();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const navigate = useNavigate();

  const renameAccount = useCallback(
    async (renamedName: string) => {
      currentWallet.accounts[accId].name = renamedName;
      await updateCurrentWallet(currentWallet);
      await walletController.saveWallets();
      navigate("/home");
    },
    [currentWallet, updateCurrentWallet, walletController, navigate]
  );

  if (Number(accId) >= 0) {
    return (
      <div className={s.renameAccount}>
        <Rename
          handler={renameAccount}
          oldName={currentWallet.accounts[accId].name}
          otherNames={currentWallet?.accounts.map((f) => f.name!)}
        />
      </div>
    );
  }

  return <div>Error</div>;
};

export default RenameAccount;
