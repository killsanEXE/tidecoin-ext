import ReactLoading from "react-loading";
import { RouterProvider } from "react-router-dom";
import { Router } from "@remix-run/router";
import { useCallback, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  setupKeyringProxy,
  setupNotificationProxy,
  setupOpenAPIProxy,
  setupStateProxy,
  setupWalletProxy,
} from "@/ui/utils/setup";
import { useAppState } from "./states/appState";
import { useWalletState } from "./states/walletState";
import { guestRouter, authenticatedRouter } from "@/ui/pages/router";
import { useControllersState } from "./states/controllerState";
import { excludeKeysFromObj } from "@/shared/utils";

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

  const setupApp = useCallback(async () => {
    const walletController = setupWalletProxy();
    const apiController = setupOpenAPIProxy();
    const stateController = setupStateProxy();
    const keyringController = setupKeyringProxy();
    const notificationController = setupNotificationProxy();

    updateControllers({
      walletController,
      apiController,
      stateController,
      keyringController,
      notificationController,
    });

    const appState = await stateController.getAppState();
    const walletState = await stateController.getWalletState();

    if (appState.isReady && appState.isUnlocked && walletState.selectedWallet !== undefined) {
      await updateWalletState(walletState);
      await updateAppState(appState);
    } else {
      await updateWalletState({
        vaultIsEmpty: await walletController.isVaultEmpty(),
        ...excludeKeysFromObj(walletState, ["vaultIsEmpty", "wallets"]),
      });
      await updateAppState({
        isReady: true,
        ...excludeKeysFromObj(appState, ["isReady", "isUnlocked", "password", "vault"]),
      });
    }
  }, [updateWalletState, updateAppState, updateControllers]);

  useEffect(() => {
    if (!isReady) setupApp();
    else if (isReady && isUnlocked) setRouter(authenticatedRouter);
    else setRouter(guestRouter);
  }, [isReady, isUnlocked, updateWalletState, updateAppState, router, setRouter, setupApp]);

  return (
    <div>
      <div className="uppercase text-center hidden md:block font-medium text-xl mb-6 select-none">Tidecoin</div>
      <div className="app">
        {isReady ? <RouterProvider router={router} /> : <ReactLoading type="spin" color="#ffbc42" />}
        <Toaster
          position="top-center"
          toastOptions={{
            className: "toast",
            success: {
              duration: 900,
            },
            error: {
              duration: 4000,
            },
          }}
        />
      </div>
    </div>
  );
}
