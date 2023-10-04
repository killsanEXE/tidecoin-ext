import {
  browserStorageLocalGet,
  browserStorageLocalSet,
} from "@/shared/utils/browser";
import * as encryptorUtils from "@metamask/browser-passworder";
import { IWallet } from "@/shared/interfaces";
import { DecryptedSecrets, StorageInterface } from "./types";

class StorageService {
  async saveWallets(password: string, wallets: IWallet[]) {
    const phrases = wallets.map((w) => w.phrase);
    const walletsToSave = wallets.map((wallet) => {
      return {
        name: wallet.name,
        accounts: wallet.accounts.map((account) => ({
          id: account.id,
          name: account.name ?? "",
        })),
      };
    });
    const encrypted = await encryptorUtils.encrypt(
      password,
      JSON.stringify(phrases)
    );

    const data: StorageInterface = {
      enc: JSON.parse(encrypted),
      cache: walletsToSave,
    };

    await browserStorageLocalSet(data);
  }

  async getLocalValues() {
    return await browserStorageLocalGet<StorageInterface>(undefined);
  }

  async importWallets(password: string): Promise<IWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];
    const decryptedPhrases: DecryptedSecrets = JSON.parse(
      (await encryptorUtils.decrypt(
        password,
        JSON.stringify(encrypted.enc)
      )) as string
    );
    return encrypted.cache.map((i, index: number) => ({
      ...i,
      id: index,
      phrase: decryptedPhrases[index],
    }));
  }
}

export default new StorageService();
