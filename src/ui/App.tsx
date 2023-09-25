import ReactLoading from 'react-loading';
import './App.scss';
import { RouterProvider } from 'react-router-dom';
import { Router } from '@remix-run/router'
import { useEffect, useState } from 'react';
import { Toaster } from "react-hot-toast";
import { setupWalletProxy } from '@/ui/utils/setup';
import { useAppState } from './states/appState';
import { useWalletState } from './states/walletState';
import { guestRouter, authenticatedRouter } from "@/ui/pages/router";

export default function App() {
  const [ router, setRouter ] = useState<Router>(guestRouter);

  const { isReady, isUnlocked, updateAppState } = useAppState((v) => ({
    isReady: v.isReady,
    isUnlocked: v.isUnlocked,
    updateAppState: v.updateAppState,
  }));

  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }))


  useEffect(() => {
    const setupApp = async () => {
      const walletController = setupWalletProxy();
      updateWalletState({ controller: walletController, vaultIsEmpty: await walletController.isVaultEmpty() });
      updateAppState({ isReady: true });
    }

    if (!isReady) setupApp();
    else if (isReady && isUnlocked) setRouter(authenticatedRouter);
  }, [ isReady, isUnlocked, setupWalletProxy, updateWalletState, updateAppState, router, setRouter ]);

  return (
    <div className='app'>
      {isReady ? <RouterProvider router={router}/> : <ReactLoading type="spin" color="#fff"/>}
      <Toaster position="bottom-center" toastOptions={{
        className: "toast"
      }}/>
    </div>
  );
}