import './CreatePassword.scss'
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/ui/shared/states/appState';
import { useWalletState } from '@/ui/shared/states/walletState';
import { useState } from 'react';

export default function CreatePassword() {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
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
      const wallet = await walletController.createNewWallet();
      await walletController.saveWallets(password, [wallet])
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