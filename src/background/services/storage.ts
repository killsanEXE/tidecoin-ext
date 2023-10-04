import {
  browserStorageLocalGet,
  browserStorageLocalSet,
} from "@/shared/utils/browser";
import * as encryptorUtils from "@metamask/browser-passworder";
import { IWallet } from "@/shared/interfaces";

class StorageService {
  async saveWallets(password: string, wallets: IWallet[]) {
    const walletsToSave = wallets.map((wallet) => {
      return {
        phrase: wallet.phrase,
        name: wallet.name,
        accounts: wallet.accounts.map((account) => ({
          id: account.id,
          name: account.name ?? "",
        })),
      };
    });
    const encrypted = await encryptorUtils.encrypt(
      password,
      JSON.stringify(walletsToSave)
    );
    await browserStorageLocalSet(JSON.parse(encrypted));
  }

  async getLocalValues() {
    const data = (await browserStorageLocalGet(undefined)) as any;
    return data;
  }

  async importWallets(password: string): Promise<IWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];
    const decrypted: IWallet[] = JSON.parse(
      (await encryptorUtils.decrypt(password, JSON.stringify(encrypted))) as any
    );
    return decrypted.map((i, index) => ({ ...i, id: index }));
  }
}

export default new StorageService();
