import { useState } from 'react';
import './Login.scss'
import { appStore } from '../../../stores/appStore';
import { Account } from '../../../stores/accountStore';
const passworder = require("browser-passworder");

type Props = {}

export default function Login({}: Props) {

  const appState = appStore();

  const [password, setPassword] = useState("");

  const login = async () => {
    try{
      for(let acc of appState.vaultAccounts){
        let account: Account = await passworder.decrypt(password, acc);
        console.log(account);
        appState.exportedAccounts.push(account)
      }
    }catch(e){
      console.log(e);
    }
  }

  return (
    <form>
      <input type="text" onChange={(e) => {setPassword(e.target.value)}}/>
      <button onClick={login}>Create password</button>
    </form>
  )
}