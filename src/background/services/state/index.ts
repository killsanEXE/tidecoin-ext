import { IAppStateBase, IWallet, IWalletStateBase } from "@/shared/interfaces";

class StateService {

    private walletState: IWalletStateBase;
    private appState: IAppStateBase;

    private emptyWalletState(): IWalletStateBase {
        return {
            wallets: new Map<number, IWallet>(),
            vaultIsEmpty: true
        }
    }

    private emptyAppState(): IAppStateBase {
        return {
            isReady: false,
            isUnlocked: false,
            vault: [],
            password: undefined,
        }
    }

    constructor() {
        this.walletState = this.emptyWalletState();
        this.appState = this.emptyAppState();
    }

    updateWalletState(state: Partial<IWalletStateBase>) { this.walletState = { ...this.walletState, ...state }; }
    updateAppState(state: Partial<IAppStateBase>) { this.appState = { ...this.appState, ...state }; }

    getWalletState() { return this.walletState }
    getAppState() { return this.appState }
}

export default new StateService();
