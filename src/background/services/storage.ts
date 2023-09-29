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
        id: wallet.id,
        accounts: wallet.accounts.map((account) => ({
          id: account.id,
          name: account.name ?? "",
        })),
      };
    });
    const encrypted = await this.encryptData(
      password,
      JSON.stringify(walletsToSave)
    );

    await browserStorageLocalSet(encrypted);
  }

  async getLocalValues() {
    const data = (await browserStorageLocalGet(undefined)) as any;
    return data as string | undefined;
  }

  async importWallets(password: string): Promise<IWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];
    const decrypted: IWallet[] = (await this.decryptData(
      password,
      encrypted
    )) as any;
    return decrypted.map((i, index) => ({ ...i, id: index }));
  }

  private async encryptData(password: string, data: string) {
    return await encryptorUtils.encrypt(password, data);
  }

  private async decryptData(password: string, encryptedData: string) {
    return await encryptorUtils.decrypt(password, encryptedData);
  }
}

export default new StorageService();
