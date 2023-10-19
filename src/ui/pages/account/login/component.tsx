import { useEffect } from "react";
import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSyncStorages } from "@/ui/utils/setup";

interface FormType {
  password: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<FormType>({
    defaultValues: {
      password: "",
    },
  });
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, vaultIsEmpty } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    vaultIsEmpty: v.vaultIsEmpty,
  }));
  const navigate = useNavigate();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));
  const syncStorages = useSyncStorages();

  useEffect(() => {
    if (vaultIsEmpty) navigate("/account/create-password");
  }, [vaultIsEmpty]);

  const login = async ({ password }: FormType) => {
    try {
      const exportedWallets = await walletController.importWallets(password);
      const { walletState } = await syncStorages();
      const selectedWallet = walletState.selectedWallet;
      console.log(exportedWallets);
      console.log(selectedWallet);
      exportedWallets[selectedWallet].accounts = await walletController.loadAccountsData(
        selectedWallet,
        exportedWallets[selectedWallet].accounts
      );
      await updateWalletState({
        wallets: exportedWallets,
      });
      await updateAppState({
        isUnlocked: true,
        password: password,
      });
      navigate("/home");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(login)}>
      <p className={s.formTitle}>Enter your password</p>
      <input type="password" className="input" {...register("password")} />
      <button className="btn primary" type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
