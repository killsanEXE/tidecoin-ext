import { useNavigate, useParams } from "react-router-dom";
import s from "./styles.module.scss";
import { useEffect, useState } from "react";
import { IAccount } from "@/shared/interfaces";
import { useGetCurrentWallet } from "@/ui/states/walletState";
import Rename from "@/ui/components/rename";
import { useUpdateCurrentWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";
import ReactLoading from "react-loading";

const RenameAccount = () => {
  const { accId } = useParams();
  const [account, setAccount] = useState<IAccount | undefined>(undefined);
  const currentWallet = useGetCurrentWallet();
  const updateCurrentWallet = useUpdateCurrentWallet();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const navigate = useNavigate();

  const renameAccount = async (renamedName: string) => {
    const accIndex = currentWallet?.accounts.indexOf(account!);
    const wallet = currentWallet;
    wallet!.accounts[accIndex!].name = renamedName;
    await updateCurrentWallet({ ...wallet });
    await walletController.saveWallets();
    navigate(-1);
  };

  useEffect(() => {
    if (!account) {
      setAccount(currentWallet?.accounts.find((f) => f.id === Number(accId)));
    }
  }, [setAccount, currentWallet, accId]);

  return (
    <div className={s.renameAccount}>
      {account ? (
        <Rename
          handler={renameAccount}
          oldName={account.name}
          otherNames={currentWallet?.accounts.map((f) => f.name!)}
        />
      ) : (
        <ReactLoading type="spin" color="#ffbc42" />
      )}
    </div>
  );
};

export default RenameAccount;
