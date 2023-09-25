import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppState } from '@/ui/states/appState';
import { useWalletState } from '@/ui/states/walletState';

const CreatePassword = () => {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const { createNewWallet } = useWalletState((v) => ({
    createNewWallet: v.createNewWallet
  }));

  const [ password, setPassword ] = useState("");
  const [ passwordConfirm, setPasswordConfirm ] = useState("");
  const navigate = useNavigate();

  const createPassword = async () => {
    if (password === passwordConfirm) {
      await createNewWallet(password);
      updateAppState({ password: password, isUnlocked: true });
      navigate("/home/wallet");
    }
  }

  return (
    <form className='form' onSubmit={(e) => e.preventDefault()}>
      <p className='form-title'>Create new password</p>
      <input
        type="password"
        className='input'
        onChange={(e) => {
          setPassword(e.target.value)
        }}
      />
      <input
        type="password"
        className='input'
        onChange={(e) => {
          setPasswordConfirm(e.target.value)
        }}
      />

      <button className='btn primary' onClick={createPassword}>Create password</button>
    </form>
  )
}

export default CreatePassword