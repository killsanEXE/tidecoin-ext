import { useEffect } from "react";
import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";
import { useForm } from "react-hook-form";

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

  useEffect(() => {
    if (vaultIsEmpty) navigate("/account/create-password");
  }, [vaultIsEmpty]);

  const login = async ({ password }: FormType) => {
    const exportedWallets = await walletController.importWallets(password);
    exportedWallets[0].accounts = await walletController.loadAccountsData(
      0,
      exportedWallets[0].accounts
    );
    await updateWalletState({
      selectedAccount: 0,
      selectedWallet: 0,
      wallets: exportedWallets,
    });
    await updateAppState({
      isUnlocked: true,
      password: password,
    });
    navigate("/home/wallet");
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
