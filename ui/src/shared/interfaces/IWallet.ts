import IAccount from "./IAccount";

export interface IWallet {
    publicKey: string;
    privateKey: string;
    name: string;
    phrase: string;
    accounts: IAccount[];
}

export interface IWalletState {
    wallets: IWallet[];
    currentWallet?: IWallet;
    createNewWallet: (name?: string) => void;
    updateCurrentWalletName: (name: string) => void;
    updateWalletState: (state: Partial<IWalletState>) => void;
    createNewAccount: () => IWallet[];
}