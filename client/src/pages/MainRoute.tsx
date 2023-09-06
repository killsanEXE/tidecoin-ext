import { useAppState } from 'shared/states/appState'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    console.log(`NAVIGATING TO ${get_correct_route(vaultAccounts, isUnlocked)}`)
    navigate(get_correct_route(vaultAccounts, isUnlocked));
  }, [vaultAccounts, isUnlocked])

  return (
    <div className='main-route'>
      {props.children}
    </div>
  )
}
//tsrfc