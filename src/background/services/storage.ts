import {
  browserStorageLocalGet,
  browserStorageLocalSet,
} from "@/shared/utils/browser";
import {
  bytesToHex as toHex,
  hexToBytes as fromHex,
} from "@noble/hashes/utils";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";
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
    const { encryptedData, iv, salt } = await this.encryptData(
      password,
      JSON.stringify(walletsToSave)
    );

    await browserStorageLocalSet({ vault: encryptedData, iv, salt });
  }

  async getLocalValues() {
    const data = (await browserStorageLocalGet(undefined)) as any;
    return data as { iv: string; vault: string; salt: string };
  }

  async importWallets(password: string): Promise<IWallet[]> {
    const { salt, iv, vault } = await this.getLocalValues();
    const decrypted = await this.decryptData(password, vault, salt, iv);
    const wallets: IWallet[] = JSON.parse(decrypted);
    return wallets.map((i, index) => ({ ...i, id: index }));
  }

  private async importKey(
    password: string,
    encrypt: boolean,
    salt: Uint8Array
  ) {
    const keyHash = await pbkdf2Async(
      sha256,
      new TextEncoder().encode(password),
      salt,
      {
        c: 50000,
        dkLen: 32,
      }
    );
    return await crypto.subtle.importKey(
      "raw",
      keyHash,
      { name: "AES-GCM" },
      false,
      [encrypt ? "encrypt" : "decrypt"]
    );
  }

  private async encryptData(password: string, data: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const dataBuffer = new TextEncoder().encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      await this.importKey(password, true, salt),
      dataBuffer
    );

    return {
      encryptedData: toHex(new Uint8Array(encryptedData)),
      salt: toHex(new Uint8Array(salt)),
      iv: toHex(new Uint8Array(iv)),
    };
  }

  private async decryptData(
    password: string,
    encryptedData: string,
    salt: string,
    iv: string
  ) {
    const encryptedDataBuffer = fromHex(encryptedData);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromHex(iv),
      },
      await this.importKey(password, false, fromHex(salt)),
      encryptedDataBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  }
}

export default new StorageService();
