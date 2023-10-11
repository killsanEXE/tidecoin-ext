import {
  browserStorageLocalGet,
  browserStorageLocalSet,
} from "@/shared/utils/browser";
import * as encryptorUtils from "@metamask/browser-passworder";
import { IAccount, IPrivateWallet, IWallet } from "@/shared/interfaces";
import { DecryptedSecrets, StorageInterface } from "./types";
import { IAppStateBase, IWalletStateBase } from "@/shared/interfaces";
import { emptyAppState, emptyWalletState } from "./utils";
import { keyringService } from "..";

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

  get currentWallet(): IWallet | undefined {
    const idx = this._walletState.selectedWallet;
    if (idx === undefined) return undefined;
    return this._walletState.wallets[idx];
  }

  get currentAccount(): IAccount | undefined {
    if (
      this._walletState.selectedWallet === undefined ||
      this._walletState.selectedAccount === undefined
    )
      return undefined;
    return this._walletState.wallets[this._walletState.selectedWallet].accounts[
      this._walletState.selectedAccount!
    ];
  }

  updateWalletState(state: Partial<IWalletStateBase>) {
    this._walletState = { ...this._walletState, ...state };
  }

  updateAppState(state: Partial<IAppStateBase>) {
    this._appState = { ...this._appState, ...state };
  }

  async saveWallets(
    password: string,
    wallets: IWallet[],
    payload?: DecryptedSecrets,
    newPassword?: string
  ) {
    const local = await this.getLocalValues();
    const current = await this.getSecrets(local, password);

    if (payload) {
      payload = [...(current ?? []), ...payload];
    } else {
      payload = current;
    }

    const walletsToSave = wallets.map((wallet) => {
      return {
        name: wallet.name,
        addressType: wallet.addressType,
        type: wallet.type,
        accounts: wallet.accounts.map((account) => ({
          id: account.id,
          name: account.name ?? "",
        })),
      };
    });
    const keyringsToSave = wallets.map((i) => ({
      id: i.id,
      data: keyringService.serializeById(i.id),
      phrase: payload?.find((d) => d.id === i.id)?.phrase,
    }));
    const encrypted = await encryptorUtils.encrypt(
      newPassword ?? password,
      JSON.stringify(keyringsToSave)
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

  async getWalletPhrase(index: number, password: string) {
    const encrypted = await this.getLocalValues();
    const current = await this.getSecrets(encrypted, password);
    if (current?.length === undefined || current.length < index) {
      throw new Error(`Failed to found wallet with id ${index}`);
    }
    return current[index].phrase!;
  }

  async getLocalValues() {
    return await browserStorageLocalGet<StorageInterface>(undefined);
  }

  async importWallets(password: string): Promise<IPrivateWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];

    const secrets = await this.getSecrets(encrypted, password);

    return encrypted.cache.map((i, index: number) => {
      const current = secrets?.find((i) => i.id === index);
      return {
        ...i,
        id: index,
        phrase: current?.phrase,
        data: current?.data,
      };
    });
  }

  getUniqueName(kind: "Wallet" | "Account"): string {
    if (kind === "Wallet") {
      const wallets = this.walletState.wallets;
      if (wallets.length <= 0) return "Wallet 1"
      let id = wallets[-1] ? wallets[-1].id + 1 : wallets[0].id + 1;
      let name = `Wallet ${id}`;
      const names = wallets.map(f => f.name);
      while (names.includes(name)) {
        id++;
        name = `Wallet ${id}`;
      }
      return name;
    } else {
      const accounts = this.currentWallet?.accounts;
      if (!accounts) return "Account 1";
      let id = accounts[-1] ? accounts[-1].id + 1 : accounts[0].id + 1;
      let name = `Account ${id}`;
      const names = accounts.map(f => f.name?.trim());
      while (names.includes(name.trim())) {
        id++;
        name = `Account ${id}`;
      }
      return name;
    }
  }
}

export default new StorageService();
