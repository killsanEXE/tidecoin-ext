import IAccount from "./IAccount";
import { IWalletController } from "./IWalletController";

export interface IWallet {
    name: string;
    phrase: string;
    accounts: IAccount[];
    currentAccount: IAccount;
}

export interface IWalletState {
    wallets: IWallet[];
    vaultWallets: string[];
    currentWallet?: IWallet;
    controller: IWalletController;
    updateWalletState: (state: Partial<IWalletState>) => void;
}