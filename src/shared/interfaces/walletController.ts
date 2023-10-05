import { IAccount } from "./accounts";
import { IPrivateWallet, IWallet } from "./wallets";

export interface IWalletController {
  createNewWallet: (
    exportedWallets: IWallet[],
    phrase: string,
    name?: string
  ) => Promise<IPrivateWallet>;
  saveWallets: (password: string, wallets: IPrivateWallet[]) => Promise<void>;
  isVaultEmpty: () => Promise<boolean>;
  importWallets: (password: string) => Promise<IPrivateWallet[]>;
  loadAccountsData: (wallet: IPrivateWallet) => Promise<IAccount[]>;
  createNewAccount: (
    name?: string
  ) => Promise<IAccount>;
  generateMnemonicPhrase: () => string;
}
