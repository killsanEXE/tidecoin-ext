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
  updateWalletState: (state: Partial<IWalletState>) => void;
}
