import React, { useState } from 'react'
import './CreatePassword.scss'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/ui/shared/states/appState';
import { useWalletState } from '@/ui/shared/states/walletState';

type Props = {}

export default function CreatePassword({ }: Props) {
  const { updateAppState, saveAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
    saveAppState: v.saveAppState
  }));

  const { walletController, updateWalletState } = useWalletState((v) => ({
    walletController: v.controller,
    updateWalletState: v.updateWalletState
  }));

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const createPassword = async () => {
    if (password === passwordConfirm) {
      const wallet = await walletController.createNewWallet!();
      await walletController.saveWallets!([wallet])
      await updateAppState({ password: password, isUnlocked: true });
      updateWalletState({ currentWallet: wallet })
      navigate("/home/wallet");
    }
  }

  return (
    <form className='form' onSubmit={(e) => e.preventDefault()}>
      <p className='form-title'>Create new password</p>
      <input
        type="password"
        className='input'
        onChange={(e) => { setPassword(e.target.value) }}
      />
      <input
        type="password"
        className='input'
        onChange={(e) => { setPasswordConfirm(e.target.value) }}
      />

      <button className='btn primary' onClick={createPassword}>Create password</button>
    </form>
  )
}