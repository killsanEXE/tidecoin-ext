import { IAccount } from "./accounts";
import { IWallet } from "./wallets";

export interface IWalletController {
  createNewWallet: (
    exportedWallets: IWallet[],
    phrase: string,
    name?: string
  ) => Promise<IWallet>;
  saveWallets: (password: string, wallets: IWallet[]) => Promise<void>;
  isVaultEmpty: () => Promise<boolean>;
  importWallets: (password: string) => Promise<IWallet[]>;
  loadAccountsData: (wallet: IWallet) => Promise<IAccount[]>;
  createNewAccount: (wallet: IWallet, name?: string) => Promise<IAccount>;
  loadAccountData: (account: IAccount) => Promise<Partial<IAccount>>;
  generateMnemonicPhrase: () => string;
}
