import { appStore } from '../stores/appStore'
import Account from './account/Account';
import Layout from './home/Layout';

type Props = {
}

export default function MainRoute({}: Props) {

  const appState = appStore();
  
  return (
    <div>
      {(appState.vaultAccounts.length > 0 && !appState.isUnlocked) ? 
        <Account/> : <Layout/>
      }
    </div>
  )
}

//tsrfc