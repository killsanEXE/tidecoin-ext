import { useState } from 'react';
import './Login.scss'
import { useAppState } from 'shared/states/appState';
const passworder = require("browser-passworder");

type Props = {}

export default function Login({}: Props) {

  const { vaultAccounts, updateAppState } = useAppState((v) => ({vaultAccounts: v.vaultAccounts, updateAppState: v.updateAppState}));
  const [password, setPassword] = useState("");

  const login = async () => {
    try{
      let exportedAccounts = [];
      for(let acc of vaultAccounts){
        exportedAccounts.push(await passworder.decrypt(password, acc));
      }
      await updateAppState({exportedAccounts, isUnlocked: true})
    }catch(e){
      console.log(e);
    }
  }

  return (
    <form>
      <input type="text" onChange={(e) => {setPassword(e.target.value)}}/>
      <button onClick={login}>LOGIn</button>
      {/* <button onClick={() => {appState.createNewAccount()}}>Create ACC</button> */}
    </form>
  )
}