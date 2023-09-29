import { IAccount } from "./accounts";
import { IWalletController } from "./walletController";

export interface IWallet {
  id: number;
  phrase: string;
  accounts: IAccount[];
  currentAccount: IAccount;
  name: string;
}

export interface IWalletState {
  wallets: Map<number, IWallet>;
  vaultIsEmpty: boolean;
  currentWallet?: IWallet;
  controller: IWalletController;
  updateWalletState: (state: Partial<IWalletState>) => void;
  updateCurrentWallet: (wallet: Partial<IWallet>) => void;
  createNewWallet: (password: string, phrase: string, name?: string) => Promise<void>;
  createNewAccount: (password: string, name?: string) => Promise<void>;
}
