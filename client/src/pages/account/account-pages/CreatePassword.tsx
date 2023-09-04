import React, { useState } from 'react'
import './CreatePassword.scss'
import { useAppState } from 'shared/states/appState';

type Props = {}

export default function CreatePassword({}: Props) {

  const appState = useAppState();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const createPassword = async () => {
    if(password === passwordConfirm){
      await appState.updateAppState({password: password, isUnlocked: true});
      await appState.createNewAccount();
    }
  }

  return (
    <form>
      <input type="text" onChange={(e) => {setPassword(e.target.value)}}/>
      <input type="text" onChange={(e) => {setPasswordConfirm(e.target.value)}}/>
      <button onClick={createPassword}>Create password</button>
    </form>
  )
}