import { useEffect, useState } from "react";
import "./Login.scss";
import { useAppState } from "shared/states/appState";
import IAccount from "shared/interfaces/IAccount";
import { useNavigate } from "react-router-dom";
const passworder = require("browser-passworder");

export default function Login() {
  const { vaultAccounts, updateAppState, exportedAccounts } = useAppState(
    (v) => ({
      vaultAccounts: v.vaultAccounts,
      updateAppState: v.updateAppState,
      exportedAccounts: v.exportedAccounts,
    })
  );
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (vaultAccounts.length <= 0) navigate("/account/create-password")
  }, [vaultAccounts])

  const login = async () => {
    try {
      let accounts: IAccount[] = [];
      for (let acc of vaultAccounts) {
        accounts.push(JSON.parse(await passworder.decrypt(password, acc)) as IAccount);
      }
      await updateAppState({
        exportedAccounts: [...exportedAccounts, ...accounts],
        isUnlocked: true,
        password: password,
      });
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
