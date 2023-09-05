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

function get_correct_component(vaultAccounts: string[], isUnlocked: boolean) {
  if (vaultAccounts.length > 0 && !isUnlocked) return "Login";
  else if (vaultAccounts.length <= 0 && !isUnlocked) return "CreatePassword";
  else if (isUnlocked) return "Layout";
  else return "div";
}

export default function MainRoute() {

  const { vaultAccounts, isUnlocked } = useAppState((v) => ({ vaultAccounts: v.vaultAccounts, isUnlocked: v.isUnlocked }));
  const [Component, setComponent] = useState<string>("div");

  useEffect(() => {
    setComponent(get_correct_component(vaultAccounts, isUnlocked))
    console.log(get_correct_component(vaultAccounts, isUnlocked))
  }, [vaultAccounts, isUnlocked])

  const components: { [key: string]: React.ReactNode } = {
    Login: <Login />,
    CreatePassword: <CreatePassword />,
    Layout: <Layout />,
    div: <div></div>
  }

  return (
    <div>
      {components[Component]}
      <p>{isUnlocked ? "SHIT IS UNLOCKED" : "SHIT IS TILL LOCKED"}</p>
    </div>
  )
}
//tsrfc