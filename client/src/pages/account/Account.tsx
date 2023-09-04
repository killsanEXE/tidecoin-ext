import React from 'react'
import './Account.scss'
import { useAppState } from 'shared/states/appState';
import CreatePassword from './account-pages/CreatePassword';
import Login from './account-pages/Login';

type Props = {}

export default function Account({ }: Props) {

    const appState = useAppState();

    return (
        <div>
        {(appState.vaultAccounts.length > 0) ? 
          <Login/> : <CreatePassword/>   
        }
        </div>
    )
}