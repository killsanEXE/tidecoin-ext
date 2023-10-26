import { useNavigate, useParams } from "react-router-dom";
import s from "./styles.module.scss";
import { useCallback } from "react";
import { useGetCurrentWallet } from "@/ui/states/walletState";
import Rename from "@/ui/components/rename";
import { useUpdateCurrentWallet } from "@/ui/hooks/wallet";
import toast from "react-hot-toast";

const RenameAccount = () => {
  const { accId } = useParams();
  const currentWallet = useGetCurrentWallet();
  const updateCurrentWallet = useUpdateCurrentWallet();
  const navigate = useNavigate();

  const renameAccount = useCallback(
    async (renamedName: string) => {
      if (currentWallet.accounts.map((i) => i.name).includes(renamedName.trim()))
        return toast.error("This name is already taken");

      currentWallet.accounts[accId].name = renamedName;
      await updateCurrentWallet(currentWallet);
      navigate("/home");
    },
    [currentWallet, updateCurrentWallet, navigate, accId]
  );

  return (
    <div className={s.renameAccount}>
      <Rename handler={renameAccount} oldName={currentWallet.accounts[accId].name} />
    </div>
  );
};

export default RenameAccount;
