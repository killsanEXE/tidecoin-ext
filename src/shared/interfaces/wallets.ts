import { IAccount } from "./accounts";

export interface IWallet {
  id: number;
  accounts: IAccount[];
  currentAccount?: IAccount;
  name: string;
}

export interface IPrivateWallet extends IWallet {
  phrase?: string;
  privateKey?: string;
}

export interface IWalletStateBase {
  wallets: IWallet[];
  vaultIsEmpty: boolean;
  currentWallet?: IWallet;
}

export interface IWalletState extends IWalletStateBase {
  updateWalletState: (state: Partial<IWalletState>) => Promise<void>;
}
