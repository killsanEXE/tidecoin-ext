import { IAppStateBase, IWalletState, IWalletStateBase } from "@/shared/interfaces";
import { IStateController } from "@/shared/interfaces/stateController";
import { storageService } from "../services";

class StateController implements IStateController {
  async updateAppState(state: Partial<IAppStateBase>): Promise<void> {
    await storageService.updateAppState(state);
  }

  async updateWalletState(state: Partial<IWalletState>): Promise<void> {
    storageService.updateWalletState(state);
  }

  async getWalletPhrase(index: number, password: string): Promise<string> {
    return await storageService.getWalletPhrase(index, password);
  }

  async getAppState(): Promise<IAppStateBase> {
    return storageService.appState;
  }

  async getWalletState(): Promise<IWalletStateBase> {
    return storageService.walletState;
  }
}

export default new StateController();
