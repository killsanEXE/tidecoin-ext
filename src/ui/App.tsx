import ReactLoading from 'react-loading';
import './App.scss';
import { RouterProvider, useNavigate } from 'react-router-dom';
import { Router } from '@remix-run/router'
import { useEffect, useState } from 'react';
import { Toaster } from "react-hot-toast";
import { setupWalletProxy } from '@/ui/utils/setup';
import { useAppState } from './states/appState';
import { useWalletState } from './states/walletState';
import { guestRouter, authenticatedRouter } from "@/ui/pages/router";
import { IWallet, IWalletController } from '@/shared/interfaces';

export default function App() {
  const login = async (walletController: IWalletController) => {
    const exportedWallets = await walletController.importWallets("1");
    exportedWallets[0].accounts = await walletController.loadAccountsData(exportedWallets[0])
    const map = new Map<number, IWallet>();
    exportedWallets.forEach((f) => map.set(f.id, f))
    updateWalletState({
      wallets: map,
      currentWallet: {
        ...exportedWallets[0],
        currentAccount: exportedWallets[0].accounts[0],
      },
    });
    updateAppState({
      isUnlocked: true,
      password: "1",
    });
  };

  const [router, setRouter] = useState<Router>(guestRouter);

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

      login(walletController)
    }

    if (!isReady) setupApp();
    else if (isReady && isUnlocked) setRouter(authenticatedRouter);
    else setRouter(guestRouter);
  }, [isReady, isUnlocked, setupWalletProxy, updateWalletState, updateAppState, router, setRouter]);

  return (
    <div className='app'>
      {isReady ? <RouterProvider router={router} /> : <ReactLoading type="spin" color="#fff" />}
      <Toaster position="bottom-center" toastOptions={{
        className: "toast"
      }} />
    </div>
  );
}