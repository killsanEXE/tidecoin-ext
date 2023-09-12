import { useEffect, useState } from "react";
import "./Login.scss";
import { useAppState } from "shared/states/appState";
import { useNavigate } from "react-router-dom";
import { useWalletState } from "shared/states/walletState";
import { IWallet } from "shared/interfaces/IWallet";
const passworder = require("browser-passworder");

export default function Login() {
  const { vault, updateAppState } = useAppState((v) => ({
    vault: v.vault,
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, wallets } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    wallets: v.wallets
  }))
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (vault.length <= 0) navigate("/account/create-password")
  }, [vault])

  const login = async () => {
    try {
      let exportedWallets: IWallet[] = [];
      for (let wallet of vault) {
        exportedWallets.push(JSON.parse(await passworder.decrypt("1", wallet)) as IWallet);
      }
      updateWalletState({
        wallets: [...wallets, ...exportedWallets],
        currentWallet: exportedWallets[0],
      });
      updateAppState({
        isUnlocked: true,
        password: password
      })
      navigate("/home/wallet");
    } catch (e) {
      console.log(e);
    }
  };

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
