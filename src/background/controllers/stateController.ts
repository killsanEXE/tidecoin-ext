import {
  IAppStateBase,
  IWalletState,
  IWalletStateBase,
} from "@/shared/interfaces";
import { IStateController } from "@/shared/interfaces/stateController";
import { storageService } from "../services";

class StateController implements IStateController {
  async updateAppState(state: Partial<IAppStateBase>): Promise<void> {
    storageService.updateAppState(state);
  }

  async updateWalletState(state: Partial<IWalletState>): Promise<void> {
    storageService.updateWalletState(state);
  }

  async getAppState(): Promise<IAppStateBase> {
    return storageService.appState;
  }

  async getWalletState(): Promise<IWalletStateBase> {
    return storageService.walletState;
  }
}

export default new StateController();
