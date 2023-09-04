import { useAppState } from 'shared/states/appState'
import Account from './account/Account';
import Layout from './home/Layout';

type Props = {
}

export default function MainRoute({}: Props) {

  const appState = useAppState();

  return (
    <div>
      {(appState.vaultAccounts.length > 0 && appState.isUnlocked) ? 
        <Layout/> : <Account/>
      }
    </div>
  )
}

//tsrfc