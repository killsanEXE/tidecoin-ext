import { IWalletController } from "@/shared/interfaces";
import { IApiController } from "@/shared/interfaces/apiController";
import { IKeyringController } from "@/shared/interfaces/keyringController";
import { IStateController } from "@/shared/interfaces/stateController";
import { create } from "zustand";

export interface IControllerState {
  walletController: IWalletController;
  apiController: IApiController;
  stateController: IStateController;
  keyringController: IKeyringController;
  updateControllers: (controllers: Partial<IControllerState>) => void;
}

export const useControllersState = create<IControllerState>()((set) => ({
  walletController: {} as any,
  apiController: {} as any,
  stateController: {} as any,
  keyringController: {} as any,
  updateControllers: (controllers: Partial<IControllerState>) => {
    set(controllers);
  },
}));
