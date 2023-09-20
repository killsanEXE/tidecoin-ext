import ReactLoading from 'react-loading';
import './App.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { payments } from 'tidecoinjs-lib';
import { fromMnemonic } from 'test-test-test-hd-wallet';
import { IWallet } from '@/ui/shared/interfaces/IWallet';
import { useAppState } from '@/ui/shared/states/appState';
import { useWalletState } from '@/ui/shared/states/walletState';
import { setupPm, setupWalletProxy } from './utils/setup';
import { IWalletController } from './shared/interfaces/IWalletController';
const passworder = require("browser-passworder");

function get_correct_route(vault: string[], isUnlocked: boolean) {
  if (vault.length > 0 && !isUnlocked) return "/account/login";
  else if (vault.length <= 0 && !isUnlocked) return "/account/create-password";
  else if (isUnlocked) return "/home/wallet";
  else return "/";
}

export default function App() {

  const { isReady, isUnlocked, updateAppState } = useAppState((v) => ({
    isReady: v.isReady,
    isUnlocked: v.isUnlocked,
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState, vaultWallets } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    vaultWallets: v.vaultWallets,
    walletController: v.controller
  }))


  const navigate = useNavigate();

  useEffect(() => {
    const setupApp = async () => {
      const walletController = setupWalletProxy();
      const vault = await walletController.getVaultWallets();
      updateWalletState({ controller: walletController, vaultWallets: vault });
      updateAppState({ isReady: true })
    }

    if (!isReady) setupApp();
    else navigate(get_correct_route(vaultWallets, isUnlocked));
  }, [isReady, isUnlocked]);

  return (
    <div className='app'>
      {isReady ? <Outlet /> : <ReactLoading type="spin" color="#fff" />}
      <Toaster position="bottom-center" toastOptions={{
        className: "toast"
      }} />
    </div>
  );
}