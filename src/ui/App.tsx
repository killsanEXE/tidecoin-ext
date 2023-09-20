import ReactLoading from 'react-loading';
import './App.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { useAppState } from '@/ui/shared/states/appState';
import { useWalletState } from '@/ui/shared/states/walletState';
import { setupWalletProxy } from '@/ui/utils/setup';

function get_correct_route(vault: string[], isUnlocked: boolean) {
  if (vault.length > 0) {
    if (!isUnlocked) return "/account/login";
    else return "/home/wallet";
  } else return "/account/create-password";
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
  }, [isReady, isUnlocked, setupWalletProxy, updateWalletState, updateAppState, vaultWallets]);

  return (
    <div className='app'>
      {isReady ? <Outlet /> : <ReactLoading type="spin" color="#fff" />}
      <Toaster position="bottom-center" toastOptions={{
        className: "toast"
      }} />
    </div>
  );
}