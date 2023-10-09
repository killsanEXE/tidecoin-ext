import { AddressType } from "test-test-test-hd-wallet/src/hd/types";
import { IAccount } from "./accounts";

export interface IWallet {
  id: number;
  accounts: IAccount[];
  name: string;
  addressType: AddressType;
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
}
