import React, { useState } from 'react'
import './CreatePassword.scss'
import { appStore } from '../../../stores/appStore';

type Props = {}

export default function CreatePassword({}: Props) {

  const appState = appStore();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const createPassword = () => {
    if(password === passwordConfirm){
      appState.password = password;
      appState.isUnlocked = true;
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