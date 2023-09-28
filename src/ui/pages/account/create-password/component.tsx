import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppState } from '@/ui/states/appState';

const CreatePassword = () => {
  const { updateAppState } = useAppState((v) => ({
    updateAppState: v.updateAppState,
  }));

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const createPassword = async () => {
    if (password === passwordConfirm) {
      updateAppState({ password: password, isUnlocked: true });
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