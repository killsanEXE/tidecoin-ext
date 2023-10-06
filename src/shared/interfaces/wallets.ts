import { IAccount } from "./accounts";

export interface IWallet {
  id: number;
  accounts: IAccount[];
  name: string;
}

export interface IPrivateWallet extends IWallet {
  data: any;
  phrase?: string;
}

export interface IWalletStateBase {
  wallets: IWallet[];
  vaultIsEmpty: boolean;
  selectedWallet?: number;
  selectedAccount?: number;
}

export interface IWalletState extends IWalletStateBase {
  updateWalletState: (state: Partial<IWalletState>) => Promise<void>;
  currentWallet: () => IWallet | undefined;
  currentAccount: () => IAccount | undefined;
}
