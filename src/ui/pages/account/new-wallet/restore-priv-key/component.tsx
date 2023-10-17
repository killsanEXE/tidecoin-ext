// import s from "./styles.module.scss";

import PasswordInput from "@/ui/components/password-input";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import { useControllersState } from "@/ui/states/controllerState";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface FormType {
  privKey: string;
}

const RestorePrivKey = () => {
  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      privKey: "",
    },
  });

  const createNewWallet = useCreateNewWallet();
  const navigate = useNavigate();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  const recoverWallet = async ({ privKey }: FormType) => {
    await createNewWallet(privKey, "simple");
    await walletController.saveWallets();
    navigate("/home");
  };

  return (
    <form className="form" onSubmit={handleSubmit(recoverWallet)}>
      <PasswordInput
        label="Enter your private key"
        register={register}
        name="privKey"
      />
      <button className="btn primary" type="submit">
        Recover
      </button>
    </form>
  );
};

export default RestorePrivKey;
