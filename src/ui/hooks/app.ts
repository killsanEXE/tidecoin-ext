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
    if (addressBook.length >= 6) addressBook.splice(5, 1);
    if (addressBook.includes(address.trim())) return;
    addressBook.unshift(address.trim() ?? "");
    await updateAppState({ addressBook: addressBook });
    await walletController.saveWallets();
  }, []);
};
