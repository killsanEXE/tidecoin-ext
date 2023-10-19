import ReactLoading from "react-loading";
import { RouterProvider } from "react-router-dom";
import { Router } from "@remix-run/router";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { setupKeyringProxy, setupNotificationProxy, setupOpenAPIProxy, setupStateProxy, setupWalletProxy } from "@/ui/utils/setup";
import { useAppState } from "./states/appState";
import { useWalletState } from "./states/walletState";
import { guestRouter, authenticatedRouter } from "@/ui/pages/router";
import { useControllersState } from "./states/controllerState";
import { extractKeysFromObj } from "@/shared/utils";

export default function App() {
  const [router, setRouter] = useState<Router>(authenticatedRouter);
  const { isReady, isUnlocked, updateAppState } = useAppState((v) => ({
    isReady: v.isReady,
    isUnlocked: v.isUnlocked,
    updateAppState: v.updateAppState,
  }));

  const { updateControllers } = useControllersState((v) => ({
    updateControllers: v.updateControllers,
  }));

  const { updateWalletState } = useWalletState((v) => ({
    updateWalletState: v.updateWalletState,
  }));

  useEffect(() => {
    const setupApp = async () => {
      const walletController = setupWalletProxy();
      const apiController = setupOpenAPIProxy();
      const stateController = setupStateProxy();
      const keyringController = setupKeyringProxy();
      const notificationController = setupNotificationProxy();

      const appState = await stateController.getAppState();
      const walletState = await stateController.getWalletState();

      if (appState.isReady && appState.isUnlocked && walletState.selectedWallet !== undefined) {
        await updateWalletState(walletState);
        await updateAppState(appState);
      } else {
        await updateWalletState({
          vaultIsEmpty: await walletController.isVaultEmpty(),
          ...extractKeysFromObj(walletState, ["vaultIsEmpty", "wallets"]),
        });
        await updateAppState({
          isReady: true,
          ...extractKeysFromObj(appState, ["isReady", "isUnlocked", "password", "vault"]),
        });
      }
      updateControllers({
        walletController,
        apiController,
        stateController,
        keyringController,
        notificationController
      });
    };

    if (!isReady) setupApp();
    else if (isReady && isUnlocked) setRouter(authenticatedRouter);
    else setRouter(guestRouter);
  }, [isReady, isUnlocked, updateWalletState, updateAppState, router, setRouter]);

  return (
    <div className="app">
      {isReady ? <RouterProvider router={router} /> : <ReactLoading type="spin" color="#ffbc42" />}
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "toast",
        }}
      />
    </div>
  );
}
