import { useEffect, useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/ui/shared/states/appState";
import { useWalletState } from "@/ui/shared/states/walletState";

export default function Login() {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, wallets, vaultWallets, walletController } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    wallets: v.wallets,
    vaultWallets: v.vaultWallets,
    walletController: v.controller
  }))
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (vaultWallets.length <= 0) navigate("/account/create-password")
  }, [vaultWallets])

  const login = async () => {
    const exportedWallets = await walletController.imoprtWallets(password, vaultWallets);
    updateWalletState({
      wallets: [...wallets, ...exportedWallets],
      currentWallet: { ...exportedWallets[0], currentAccount: exportedWallets[0].accounts[0] }
    });
    updateAppState({
      isUnlocked: true,
      password: password
    })
    navigate("/home/wallet");
  }

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <p className="form-title">Enter your password</p>
      <input
        type="password"
        className="input"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button className="btn primary" onClick={login}>Login</button>
    </form>
  );
}
