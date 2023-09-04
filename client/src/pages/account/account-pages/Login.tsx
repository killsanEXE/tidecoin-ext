import { useState } from 'react';
import './Login.scss'
import { useAppState } from 'shared/states/appState';
const passworder = require("browser-passworder");

type Props = {}

export default function Login({}: Props) {

  const appState = useAppState();

  const [password, setPassword] = useState("");

  const login = async () => {
    try{
      let exportedAccounts = [];
      for(let acc of appState.vaultAccounts){
        exportedAccounts.push(await passworder.decrypt(password, acc));
      }
      appState
    }catch(e){
      console.log(e);
    }
  }

  return (
    <form>
      <input type="text" onChange={(e) => {setPassword(e.target.value)}}/>
      <button onClick={login}>Create password</button>
      {/* <button onClick={() => {appState.createNewAccount()}}>Create ACC</button> */}
    </form>
  )
}