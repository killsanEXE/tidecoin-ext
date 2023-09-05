import { useAppState } from 'shared/states/appState'
import Account from './account/Account';
import Layout from './home/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Login from './account/account-pages/Login';
import CreatePassword from './account/account-pages/CreatePassword';

type Props = {
}

function Component(props: {vaultAccounts: string[], isUnlocked: boolean}){
  console.log("COMPONENT")
  console.log(`VAULT ACCOUNTS LENGTH: ${JSON.stringify(props.vaultAccounts)}`)
  console.log(`PROPS IS UNLOCKED ${props.isUnlocked}`)
  if(props.vaultAccounts.length > 0 && !props.isUnlocked) return <Login />
  else if(props.vaultAccounts.length <= 0 && !props.isUnlocked) return <CreatePassword />
  else if(props.isUnlocked) return <Layout />
  else return null;
}

export default function MainRoute({}: Props) {

  const { vaultAccounts, isUnlocked } = useAppState((v) => ({vaultAccounts: v.vaultAccounts, isUnlocked: v.isUnlocked}));

  useEffect(() => {
    console.log(`VAULT ACCOUNTS IN EFFECT: ${JSON.stringify(vaultAccounts)}`)
  }, [vaultAccounts, isUnlocked])

  return (
    <div>
      <Component vaultAccounts={vaultAccounts} isUnlocked={isUnlocked}/>
    </div>
  )
}

//tsrfc