import { useCallback } from "react";
import { useAppState } from "../states/appState";
import { useControllersState } from "../states/controllerState";

export const useUpdateAddressBook = () => {
  const { updateAppState, addressBook } = useAppState((v) => ({
    updateAppState: v.updateAppState,
    addressBook: v.addressBook,
  }));
  const { walletController } = useControllersState((v) => ({
    walletController: v.walletController,
  }));

  return useCallback(async (address?: string) => {
    const addresses = [...addressBook];
    if (addresses.length >= 6) addresses.splice(5, 1);
    if (addresses.includes(address.trim())) return;
    addresses.unshift(address ?? "");
    await updateAppState({ addressBook: addresses });
    await walletController.saveWallets();
  }, []);
};
