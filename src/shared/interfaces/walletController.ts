import { IAccount } from "./accounts";
import { IWallet } from "./wallets";

export interface IWalletController {
  createNewWallet: (exportedWallets: IWallet[], name?: string) => Promise<IWallet>;
  saveWallets: (password: string, wallets: IWallet[]) => Promise<void>;
  isVaultEmpty: () => Promise<boolean>
  importWallets: (password: string) => Promise<IWallet[]>;
  loadAccountPublicAddress: (
    wallet: IWallet,
    account: IAccount
  ) => Promise<string | undefined>;
  createNewAccount: (wallet: IWallet, name?: string) => Promise<IAccount>;
}
