import ReactLoading from 'react-loading';
import './App.scss';
import { ReactNode, useEffect, useState } from 'react';
import { useAppState } from 'shared/states/appState';
import { Outlet, useNavigate } from 'react-router-dom';

function get_correct_route(vaultAccounts: string[], isUnlocked: boolean) {
  if (vaultAccounts.length > 0 && !isUnlocked) return "/account/insert-password";
  else if (vaultAccounts.length <= 0 && !isUnlocked) return "/account/create-password";
  else if (isUnlocked) return "/home/wallet";
  else return "/";
}

export default function App() {

  const { checkVault, isReady, vaultAccounts, isUnlocked } = useAppState((v) => ({
    checkVault: v.checkVault,
    isReady: v.isReady,
    vaultAccounts: v.vaultAccounts,
    isUnlocked: v.isUnlocked
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) checkVault();
    else navigate(get_correct_route(vaultAccounts, isUnlocked));
  }, [isReady, checkVault, vaultAccounts, isUnlocked]);

  return (
    <div className='app'>
      {isReady ? <Outlet /> : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}