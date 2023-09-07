import IAccount from "./IAccount";

export default interface IWallet {
    wallets: IWallet[];
    currentWallet?: IWallet;
    phraseHash?: string;
    loadPhraseHash: () => void;
    createNewAccount: () => void;
    createNewWallet: () => void;
    updateWallets: (wallet: Partial<IWallet>) => void;
}