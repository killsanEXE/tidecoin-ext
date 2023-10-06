import ReactLoading from "react-loading";
import { RouterProvider } from "react-router-dom";
import { Router } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  setupKeyringProxy,
  setupOpenAPIProxy,
  setupStateProxy,
  setupWalletProxy,
} from "@/ui/utils/setup";
import { useAppState } from "./states/appState";
import { useWalletState } from "./states/walletState";
import { guestRouter, authenticatedRouter } from "@/ui/pages/router";
import { useControllersState } from "./states/controllerState";

export default function App() {
  const [router, setRouter] = useState<Router>(guestRouter);
  const { isReady, isUnlocked, updateAppState } = useAppState((v) => ({
    isReady: v.isReady,
    isUnlocked: v.isUnlocked,
    updateAppState: v.updateAppState,
  }));

  const { updateControllers } = useControllersState((v) => ({
    updateControllers: v.updateControllers,
  }));

  const { updateWalletState, currentWallet } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
    currentWallet: v.currentWallet,
  }));

  useEffect(() => {
    const setupApp = async () => {
      const walletController = setupWalletProxy();
      const apiController = setupOpenAPIProxy();
      const stateController = setupStateProxy();
      const keyringController = setupKeyringProxy();

      const appState = await stateController.getAppState();
      const walletState = await stateController.getWalletState();

      if (
        appState.isReady &&
        appState.isUnlocked &&
        currentWallet() !== undefined
      ) {
        await updateWalletState(walletState);
        await updateAppState(appState);
      } else {
        await updateWalletState({
          vaultIsEmpty: await walletController.isVaultEmpty(),
        });
        await updateAppState({ isReady: true });
      }
      updateControllers({
        walletController,
        apiController,
        stateController,
        keyringController,
      });
    };

    if (!isReady) setupApp();
    else if (isReady && isUnlocked) setRouter(authenticatedRouter);
    else setRouter(guestRouter);
  }, [
    isReady,
    isUnlocked,
    updateWalletState,
    updateAppState,
    router,
    setRouter,
  ]);

  return (
    <div className="app">
      {isReady ? (
        <RouterProvider router={router} />
      ) : (
        <ReactLoading type="spin" color="#fff" />
      )}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "toast",
        }}
      />
    </div>
  );
}
