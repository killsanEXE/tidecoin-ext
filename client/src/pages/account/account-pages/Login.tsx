import { useState } from "react";
import "./Login.scss";
import { useAppState } from "shared/states/appState";
import { useNavigate } from "react-router-dom";
import Account from "shared/interfaces/AccountInterface";
import { log } from "console";
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
      <button onClick={login}>LOGIn</button>
    </form>
  );
}
