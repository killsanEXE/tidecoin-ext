import { useAppState } from 'shared/states/appState'
import Account from './account/Account';
import Layout from './home/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

type Props = {
}

export default function MainRoute({}: Props) {

  const navigate = useNavigate();
  const { vaultAccounts, isUnlocked } = useAppState((v) => ({vaultAccounts: v.vaultAccounts, isUnlocked: v.isUnlocked}));
  const [ checked, setChecked ] = useState(false);

  useEffect(() => {
    if(!isUnlocked && !checked) navigate("/account");
    setChecked(true);
  }, [vaultAccounts, isUnlocked, checked])

  return (
    <div>
      {checked ? <Layout/> : <ReactLoading type="spin" color="#fff" />}
    </div>
  )
}

//tsrfc