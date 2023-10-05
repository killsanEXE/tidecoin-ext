import { IAccount } from "./accounts";

export interface IWallet {
  id: number;
  phrase: string;
  accounts: IAccount[];
  currentAccount?: IAccount;
  name: string;
}

export interface IWalletStateBase {
  wallets: IWallet[];
  vaultIsEmpty: boolean;
  currentWallet?: IWallet;
}

export interface IWalletState extends IWalletStateBase {
  updateWalletState: (state: Partial<IWalletState>) => void;
}
