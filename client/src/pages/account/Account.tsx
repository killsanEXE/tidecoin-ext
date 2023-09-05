import React, { useEffect } from 'react'
import './Account.scss'
import { useAppState } from 'shared/states/appState';
import CreatePassword from './account-pages/CreatePassword';
import Login from './account-pages/Login';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';

type Props = {}

export default function Account({ }: Props) {

  const navigate = useNavigate();
  const { vaultAccounts } = useAppState((v) => ({vaultAccounts: v.vaultAccounts }));

  useEffect(() => {
    if(vaultAccounts.length > 0) navigate("/account/login");
    else navigate("/account/create-password");
  }, [vaultAccounts])

    return (
      <ReactLoading type="spin" color="#fff" />
    )
}