import { useAppState } from 'shared/states/appState'
import Account from './account/Account';
import Layout from './home/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Login from './account/account-pages/Login';
import CreatePassword from './account/account-pages/CreatePassword';

function get_correct_route(vaultAccounts: string[], isUnlocked: boolean) {
  if (vaultAccounts.length > 0 && !isUnlocked) return "/account/insert-password";
  else if (vaultAccounts.length <= 0 && !isUnlocked) return "/account/create-password";
  else if (isUnlocked) return "/home/wallet";
  else return "/";
}

export default function MainRoute(props: any) {

  const { vaultAccounts, isUnlocked } = useAppState((v) => ({ vaultAccounts: v.vaultAccounts, isUnlocked: v.isUnlocked }));
  const navigate = useNavigate();

  useEffect(() => {
    alert(`NAVIGATING TO ${get_correct_route(vaultAccounts, isUnlocked)}`)
    navigate(get_correct_route(vaultAccounts, isUnlocked));
    console.log(props)
  }, [vaultAccounts, isUnlocked])

  return (
    <div className='main-route'>
      {props.children}
      <p>HELLLO MOTHERFUCKER </p>
    </div>
  )
}
//tsrfc