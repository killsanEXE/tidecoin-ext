import { IWallet } from "./IWallet";

export interface IWalletController {
    getVaultWallets: () => Promise<string[]>;
    createNewWallet: (name?: string) => Promise<IWallet>;
    saveWallets: (password: string, wallets: IWallet[]) => void;
    imoprtWallets: (password: string, wallets: string[]) => Promise<IWallet[]>
}