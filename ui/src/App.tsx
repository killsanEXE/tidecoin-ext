import ReactLoading from 'react-loading';
import './App.scss';
import { useAppState } from 'shared/states/appState';
import { Outlet, useNavigate } from 'react-router-dom';
import { useWalletState } from 'shared/states/walletState';
import { IWallet } from 'shared/interfaces/IWallet';
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
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

  const { updateWalletState, wallets, createNewAccount } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    wallets: v.wallets,
    createNewAccount: v.createNewAccount
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
        currentWallet: exportedWallets[0],
      });
      updateAppState({
        isUnlocked: true,
        password: "1"
      })
      for (let i = 0; i <= 20; i++) {
        createNewAccount();
      }
      // navigate(get_correct_route(vault, isUnlocked));
      navigate("/switch-account/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!isReady) checkVault();
    else {
      navigate(get_correct_route(vault, isUnlocked));
      // LOGIN_FOR_TESTS()
    }
  }, [isReady, checkVault, isUnlocked]);

  return (
    <div className='app'>
      {isReady ? <Outlet /> : <ReactLoading type="spin" color="#fff" />}
      <Toaster position="bottom-center" toastOptions={{
        className: "toast"
      }} />
    </div>
  );
}