import { browserStorageLocalGet, browserStorageLocalSet } from "@/shared/utils/browser";
import * as encryptorUtils from "@metamask/browser-passworder";
import { IAccount, IPrivateWallet, IWallet } from "@/shared/interfaces";
import { DecryptedSecrets, StorageInterface } from "./types";
import { IAppStateBase, IWalletStateBase } from "@/shared/interfaces";
import { emptyAppState, emptyWalletState } from "./utils";
import { keyringService, permissionService, storageService } from "..";
import { excludeKeysFromObj } from "@/shared/utils";

class StorageService {
  private _walletState: IWalletStateBase;
  private _appState: IAppStateBase;

  constructor() {
    this._walletState = emptyWalletState();
    this._appState = emptyAppState();
    this.loadLanguage();
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
    if (this._walletState.selectedWallet === undefined || this._walletState.selectedAccount === undefined)
      return undefined;
    return this._walletState.wallets[this._walletState.selectedWallet].accounts[this._walletState.selectedAccount];
  }

  async loadLanguage() {
    const data = await this.getLocalValues();
    if (data && data.cache && data.cache.language) await this.updateAppState({ language: data.cache.language });
  }

  async updateWalletState(state: Partial<IWalletStateBase>) {
    this._walletState = { ...this._walletState, ...state };

    if (state.selectedAccount !== undefined || state.selectedWallet !== undefined) {
      const localState = await this.getLocalValues();
      const cache: StorageInterface["cache"] = {
        ...localState.cache,
      };
      if (state.selectedAccount !== undefined) cache.selectedAccount = state.selectedAccount;
      if (state.selectedWallet !== undefined) cache.selectedWallet = state.selectedWallet;

      const payload: StorageInterface = {
        cache,
        enc: localState.enc,
      };

      await browserStorageLocalSet(payload);
    }
  }

  async updateAppState(state: Partial<IAppStateBase>) {
    this._appState = { ...this._appState, ...state };
    if (state.addressBook !== undefined || state.pendingWallet !== undefined) {
      const localState = await this.getLocalValues();
      const cache: StorageInterface["cache"] = {
        ...localState.cache,
      };

      if (state.addressBook !== undefined) cache.addressBook = state.addressBook;
      if (state.pendingWallet !== undefined) cache.pendingWallet = state.pendingWallet;

      const payload: StorageInterface = {
        cache: cache,
        enc: localState.enc,
      };

      await browserStorageLocalSet(payload);
    }
  }

  async clearPendingWallet() {
    this._appState = excludeKeysFromObj(this._appState, ["pendingWallet"]);
    const localState = await this.getLocalValues();
    const newCache: StorageInterface = {
      cache: excludeKeysFromObj(localState.cache, ["pendingWallet"]),
      enc: localState.enc,
    };
    await browserStorageLocalSet(newCache);
  }

  async getPengingWallet() {
    const localState = await this.getLocalValues();
    return localState.cache.pendingWallet;
  }

  async saveWallets(password: string, wallets: IWallet[], payload?: DecryptedSecrets, newPassword?: string) {
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
    const encrypted = await encryptorUtils.encrypt(newPassword ?? password, JSON.stringify(keyringsToSave));

    const data: StorageInterface = {
      enc: JSON.parse(encrypted),
      cache: {
        ...local.cache,
        wallets: walletsToSave,
        addressBook: this.appState.addressBook,
        connectedSites: permissionService.allSites,
        language: storageService.appState.language ?? "en"
      },
    };

    await browserStorageLocalSet(data);
  }

  private async getSecrets(encrypted: StorageInterface, password: string) {
    if (!encrypted.enc) return undefined;
    const loaded = (await encryptorUtils.decrypt(password, JSON.stringify(encrypted.enc))) as string | undefined;
    return JSON.parse(loaded) as DecryptedSecrets | undefined;
  }

  async getWalletPhrase(index: number, password: string) {
    const encrypted = await this.getLocalValues();
    const current = await this.getSecrets(encrypted, password);
    if (current?.length === undefined || current.length < index) {
      throw new Error(`Failed to found wallet with id ${index}`);
    }
    return current[index].phrase;
  }

  async getLocalValues() {
    const data = await browserStorageLocalGet<StorageInterface>(undefined);
    if (Array.isArray(data.cache)) {
      const newData: StorageInterface = {
        cache: {
          addressBook: (data as any).addressBook,
          selectedWallet: 0,
          selectedAccount: 0,
          wallets: data.cache,
          connectedSites: data.cache.connectedSites,
        },
        enc: data.enc,
      };
      await browserStorageLocalSet(newData);
      return newData;
    }
    return data;
  }

  async importWallets(password: string): Promise<IPrivateWallet[]> {
    const encrypted = await this.getLocalValues();
    if (!encrypted) return [];

    await this.updateAppState({
      addressBook: encrypted.cache.addressBook,
    });

    permissionService.setConnectedSites(encrypted.cache.connectedSites);

    await this.updateWalletState({
      selectedAccount: encrypted.cache.selectedAccount,
      selectedWallet: encrypted.cache.selectedWallet,
    });

    const secrets = await this.getSecrets(encrypted, password);

    return encrypted.cache.wallets.map((i, index: number) => {
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
      if (wallets.length <= 0) return "Wallet 1";
      return `Wallet ${this.getUniqueId(
        wallets.map((f) => f.name ?? ""),
        "Wallet"
      )}`;
    } else {
      const accounts = this.currentWallet?.accounts;
      if (!accounts) return "Account 1";
      return `Account ${this.getUniqueId(
        accounts.map((f) => f.name ?? ""),
        "Account"
      )}`;
    }
  }

  private getUniqueId(names: string[], type: "Account" | "Wallet") {
    const ids: number[] = names.map((f) => {
      const name = f.trim();
      if (name.includes(type) && name.split(" ").length === 2) {
        const accountid = name.split(" ")[1];
        if (!Number.isNaN(Number(accountid))) {
          return Number.parseInt(accountid);
        }
        return 0;
      }
      return 0;
    });
    return Math.max(...ids) + 1;
  }
}

export default new StorageService();
