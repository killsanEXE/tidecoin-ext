import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { IAccount } from "./accounts";
import { IWallet } from "./wallets";

export interface IWalletController {
  createNewWallet: (exportedWallets: IWallet[], name?: string) => Promise<IWallet>;
  saveWallets: (password: string, wallets: IWallet[]) => Promise<void>;
  isVaultEmpty: () => Promise<boolean>
  importWallets: (password: string) => Promise<IWallet[]>;
  loadAccountsData: (wallet: IWallet) => Promise<IAccount[]>;
  createNewAccount: (wallet: IWallet, name?: string) => Promise<IAccount>;
  loadAccountData: (account: IAccount) => Partial<IAccount>;
  generateMnemonicPhrase: () => string;
}
