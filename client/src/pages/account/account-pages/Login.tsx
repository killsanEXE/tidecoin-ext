import { useState } from "react";
import "./Login.scss";
import { useAppState } from "shared/states/appState";
import { useNavigate } from "react-router-dom";
import Account from "shared/interfaces/AccountInterface";
import { log } from "console";
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

  const login = async () => {
    try {
      let accounts: Account[] = [];
      for (let acc of vaultAccounts) {
        accounts.push(await passworder.decrypt(password, acc));
      }
      await updateAppState({
        exportedAccounts: [...exportedAccounts, accounts],
        isUnlocked: true,
        password: password,
      });
      navigate("/account/create-password")
      navigate("/")
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={login} type="submit">LOGIn</button>
    </form>
  );
}
