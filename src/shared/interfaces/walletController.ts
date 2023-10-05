import { IAccount } from "./accounts";
import { IPrivateWallet } from "./wallets";

export interface IWalletController {
  createNewWallet: (
    phrase: string,
    name?: string
  ) => Promise<IPrivateWallet>;
  saveWallets: () => Promise<void>;
  isVaultEmpty: () => Promise<boolean>;
  importWallets: (password: string) => Promise<IPrivateWallet[]>;
  loadAccountsData: (wallet: IPrivateWallet) => Promise<IAccount[]>;
  createNewAccount: (
    name?: string
  ) => Promise<IAccount>;
  generateMnemonicPhrase: () => string;
}
