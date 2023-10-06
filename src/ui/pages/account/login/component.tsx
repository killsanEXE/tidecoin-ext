import { useEffect, useState } from "react";
import s from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";

const Login = () => {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, vaultIsEmpty } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    vaultIsEmpty: v.vaultIsEmpty,
  }));
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  useEffect(() => {
    if (vaultIsEmpty) navigate("/account/create-password");
  }, [vaultIsEmpty]);

  const login = async () => {
    const exportedWallets = await walletController.importWallets(password);
    exportedWallets[0].accounts = await walletController.loadAccountsData(
      0,
      exportedWallets[0].accounts
    );
    await updateWalletState({
      wallets: exportedWallets,
      currentWallet: {
        ...exportedWallets[0],
        currentAccount: exportedWallets[0].accounts[0],
      },
    });
    await updateAppState({
      isUnlocked: true,
      password: password,
    });
    navigate("/home/wallet");
  };

  return (
    <form className={s.form} onSubmit={(e) => e.preventDefault()}>
      <p className={s.formTitle}>Enter your password</p>
      <input
        type="password"
        className="input"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button className="btn primary" onClick={login}>
        Login
      </button>
    </form>
  );
};

export default Login;
