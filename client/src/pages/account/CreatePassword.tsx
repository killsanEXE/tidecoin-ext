import React, { useState } from 'react'
import './CreatePassword.scss'
import { useAppState } from 'shared/states/appState';
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function CreatePassword({}: Props) {
  const { updateAppState, createNewAccount, saveAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
    createNewAccount: v.createNewAccount,
    saveAppState: v.saveAppState
  }));

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const createPassword = async () => {
    if(password === passwordConfirm){
      await updateAppState({password: password, isUnlocked: true});
      await createNewAccount();
      await saveAppState();
      navigate("/home");
    }
  }

  return (
    <form className='form' onSubmit={(e) => e.preventDefault()}>
      <p className='form-title'>Create new password</p>
      <input
       type="password" 
       className='input' 
       onChange={(e) => {setPassword(e.target.value)}}
       />
      <input
       type="password" 
       className='input' 
       onChange={(e) => {setPasswordConfirm(e.target.value)}}
       />

      <button className='btn primary' onClick={createPassword}>Create password</button>
    </form>
  )
}