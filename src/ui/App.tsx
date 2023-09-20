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

  const { updateWalletState, wallets, createNewAccount, vaultWallets } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    wallets: v.wallets,
    createNewAccount: v.createNewAccount,
    vaultWallets: v.vaultWallets
  }))


  const navigate = useNavigate();

  useEffect(() => {

    const async_shit = async () => {
      const wallet = setupWalletProxy();
      const accounts = await wallet.getVaultWallets();
      console.log(`accounts from background: ${JSON.stringify(accounts)}`);
      console.log(`ACCOUNTS STRAIGHT FROM THE CHROEM: ${JSON.stringify(await chrome.storage.local.get(undefined))}`)
      return accounts;
    }

    if (!isReady) {
      async_shit();
    }
    else {
      navigate(get_correct_route(vaultWallets, isUnlocked));
      // LOGIN_FOR_TESTS()
    }
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