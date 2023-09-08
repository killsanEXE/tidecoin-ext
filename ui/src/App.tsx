import ReactLoading from 'react-loading';
import './App.scss';
import { useAppState } from 'shared/states/appState';
import { Outlet, useNavigate } from 'react-router-dom';
import { useWalletState } from 'shared/states/walletState';
import { IWallet } from 'shared/interfaces/IWallet';
import { useEffect } from 'react';
const passworder = require("browser-passworder");

function get_correct_route(vault: string[], isUnlocked: boolean) {
  if (vault.length > 0 && !isUnlocked) return "/account/login";
  else if (vault.length <= 0 && !isUnlocked) return "/account/create-password";
  else if (isUnlocked) return "/home/wallet";
  else return "/";
}

export default function App() {

  const { checkVault, isReady, vault, isUnlocked, updateAppState } = useAppState((v) => ({
    checkVault: v.checkVault,
    isReady: v.isReady,
    vault: v.vault,
    isUnlocked: v.isUnlocked,
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, wallets } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    wallets: v.wallets
  }))

  const navigate = useNavigate();

  const LOGIN_FOR_TESTS = async () => {
    try {
      let exportedWallets: IWallet[] = [];
      for (let wallet of vault) {
        exportedWallets.push(JSON.parse(await passworder.decrypt("1", wallet)) as IWallet);
      }
      updateWalletState({
        wallets: [...wallets, ...exportedWallets],
      });
      updateAppState({
        isUnlocked: true,
        password: "1"
      })
      navigate(get_correct_route(vault, isUnlocked));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!isReady) checkVault();
    else {
      navigate(get_correct_route(vault, isUnlocked));
    }
  }, [isReady, checkVault, wallets, isUnlocked]);

  return (
    <div className='app'>
      {isReady ? <Outlet /> : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}