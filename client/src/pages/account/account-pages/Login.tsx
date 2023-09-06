import { useState } from "react";
import "./Login.scss";
import { useAppState } from "shared/states/appState";
import IAccount from "shared/interfaces/IAccount";
import { useNavigate } from "react-router-dom";
const passworder = require("browser-passworder");

export default function Login() {
  const { vaultAccounts, updateAppState, exportedAccounts, createNewAccount} = useAppState(
    (v) => ({
      vaultAccounts: v.vaultAccounts,
      updateAppState: v.updateAppState,
      exportedAccounts: v.exportedAccounts,
      createNewAccount: v.createNewAccount
    })
  );
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      let accounts: IAccount[] = [];
      for (let acc of vaultAccounts) {
        accounts.push(await passworder.decrypt(password, acc));
      }
      await updateAppState({
        exportedAccounts: [...exportedAccounts, accounts as any],
        isUnlocked: true,
        password: password,
      });
      navigate("/home");
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
