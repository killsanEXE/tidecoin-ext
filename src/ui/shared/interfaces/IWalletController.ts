import { IWallet } from "./IWallet";

export interface IWalletController {
    getVaultWallets: () => Promise<string[]>;
    createNewWallet: (name?: string) => Promise<IWallet>;
    saveWallets: (wallets: IWallet[]) => void;
}