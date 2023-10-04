import { IAppStateBase, IWalletState, IWalletStateBase } from "@/shared/interfaces";
import { IStateController } from "@/shared/interfaces/stateController";
import { stateService } from "../services";


export class StateController implements IStateController {
    updateAppState(state: Partial<IAppStateBase>): void {
        console.log(state)
        stateService.updateAppState(state);
        console.log(stateService.getAppState())
    }
    updateWalletState(state: Partial<IWalletState>): void {
        stateService.updateWalletState(state);
    }
    getAppState(): IAppStateBase {
        return stateService.getAppState();
    }
    getWalletState(): IWalletStateBase {
        return stateService.getWalletState();
    }
}

export default new StateController();