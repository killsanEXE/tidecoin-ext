import { IWalletController } from "@/shared/interfaces";
import { create } from "zustand";

export interface IControllerState {
    walletController: IWalletController;
    updateControllers: (controllers: Partial<IControllerState>) => void;
}

export const useControllersState = create<IControllerState>()((set) => ({
    walletController: {} as any,
    updateControllers: (controllers: Partial<IControllerState>) => {
        set(controllers);
    }
}));
