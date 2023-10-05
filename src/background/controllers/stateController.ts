import { IAppStateBase, IWalletState, IWalletStateBase } from "@/shared/interfaces";
import { IStateController } from "@/shared/interfaces/stateController";
import { stateService } from "../services";


export class StateController implements IStateController {
    async updateAppState(state: Partial<IAppStateBase>): Promise<void> {
        stateService.updateAppState(state);
    }
    async updateWalletState(state: Partial<IWalletState>): Promise<void> {
        stateService.updateWalletState(state);
    }
    async getAppState(): Promise<IAppStateBase> {
        return stateService.getAppState();
    }
    async getWalletState(): Promise<IWalletStateBase> {
        return stateService.getWalletState();
    }
}

export default new StateController();