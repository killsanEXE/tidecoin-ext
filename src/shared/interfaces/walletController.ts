import { DecryptedSecrets } from "@/background/services/storage/types";
import { IAccount } from "./accounts";
import { IPrivateWallet, IWallet } from "./wallets";

export interface IWalletController {
  createNewWallet(phrase: string, name?: string): Promise<IWallet>;
  saveWallets(phrases?: DecryptedSecrets): Promise<void>;
  isVaultEmpty(): Promise<boolean>;
  importWallets(password: string): Promise<Omit<IPrivateWallet, "data">[]>;
  loadAccountsData(
    walletId: number,
    accounts: IAccount[]
  ): Promise<IAccount[]>;
  createNewAccount(name?: string): Promise<IAccount>;
  generateMnemonicPhrase(): Promise<string>;
}
