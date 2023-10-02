import { IWalletController } from "@/shared/interfaces";
import { IApiController } from "@/shared/interfaces/apiController";
import { create } from "zustand";

export interface IControllerState {
    walletController: IWalletController;
    apiController: IApiController,
    updateControllers: (controllers: Partial<IControllerState>) => void;
}

export const useControllersState = create<IControllerState>()((set) => ({
    walletController: {} as any,
    apiController: {} as any,
    updateControllers: (controllers: Partial<IControllerState>) => {
        set(controllers);
    }
}));
