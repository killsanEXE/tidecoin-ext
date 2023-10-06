import {
  IAccount,
  IAppStateBase,
  IWallet,
  IWalletState,
  IWalletStateBase,
} from ".";

export interface IStateController {
  updateAppState(state: Partial<IAppStateBase>): Promise<void>;
  updateWalletState(state: Partial<IWalletState>): Promise<void>;
  getAppState(): Promise<IAppStateBase>;
  getWalletState(): Promise<IWalletStateBase>;
  getCurrentWallet(): Promise<IWallet | undefined>;
  getCurrentAccount(): Promise<IAccount | undefined>;
}
