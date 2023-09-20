import IAccount from "./IAccount";

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
    createNewWallet: (name?: string) => IWallet[];
    updateCurrentWalletName: (name: string) => void;
    updateWalletState: (state: Partial<IWalletState>) => void;
    createNewAccount: (name?: string) => IWallet[];
}