import {
  browserStorageLocalGet,
  browserStorageLocalSet,
} from "@/shared/utils/browser";
import * as encryptorUtils from "@metamask/browser-passworder";
import { IPrivateWallet } from "@/shared/interfaces";
import { DecryptedSecrets, StorageInterface } from "./types";
import { IAppStateBase, IWalletStateBase } from "@/shared/interfaces";
import { emptyAppState, emptyWalletState } from "./utils";

class StorageService {
  private _walletState: IWalletStateBase;
  private _appState: IAppStateBase;

  constructor() {
    this._walletState = emptyWalletState();
    this._appState = emptyAppState();
  }

  get walletState() {
    return this._walletState;
  }

  get appState() {
    return this._appState;
  }

  updateWalletState(state: Partial<IWalletStateBase>) {
    this._walletState = { ...this._walletState, ...state };
  }

  updateAppState(state: Partial<IAppStateBase>) {
    this._appState = { ...this._appState, ...state };
  }

  async saveWallets(
    password: string,
    wallets: IPrivateWallet[],
    phrases?: DecryptedSecrets
  ) {
    if (phrases) {
      const encrypted = await this.getLocalValues();
      const current = await this.getSecrets(encrypted, password);
      phrases = [...(current ?? []), ...phrases];
    }
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

  private async getSecrets(encrypted: StorageInterface, password: string) {
    if (!encrypted.enc) return undefined;
    const loaded = (await encryptorUtils.decrypt(
      password,
      JSON.stringify(encrypted.enc)
    )) as string | undefined;
    return JSON.parse(loaded!) as DecryptedSecrets | undefined;
  }

  async getLocalValues() {
    return await browserStorageLocalGet<StorageInterface>(undefined);
  }

  async importWallets(password: string): Promise<IPrivateWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];

    return await Promise.all(
      encrypted.cache.map(async (i, index: number) => ({
        ...i,
        id: index,
        phrase: (await this.getSecrets(encrypted, password))?.find((i) => i.id)
          ?.secret,
      }))
    );
  }
}

export default new StorageService();
