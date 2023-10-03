// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import * as encryptorUtils from "@metamask/browser-passworder";
import { EventEmitter } from "events";

import { KeyringControllerError } from "./consts";
import {
  Hex,
  Json,
  Keyring,
  KeyringControllerPersistentState,
  KeyringControllerState,
  SerializedKeyring,
} from "./types";
import { SimpleKey, HDPrivateKey } from "test-test-test-hd-wallet";

interface KeyringControllerArgs {
  initState?: KeyringControllerPersistentState;
  encryptor?: typeof encryptorUtils;
}

export const KEYRING_SDK_TYPES = {
  SimpleKey,
  HDPrivateKey,
};

class KeyringController extends EventEmitter {
  public store: KeyringControllerPersistentState;

  public memStore: KeyringControllerState;

  public encryptor: typeof encryptorUtils;

  public keyrings: Record<string | "root", Keyring<Json>>;

  public unsupportedKeyrings: SerializedKeyring[];

  public password?: string;

  constructor(
    { initState = {}, encryptor = encryptorUtils }: KeyringControllerArgs = {
      initState: {},
      encryptor: encryptorUtils,
    }
  ) {
    super();
    this.store = initState;
    this.memStore = {
      isUnlocked: false,
      keyrings: [],
    };

    this.encryptor = encryptor;
    this.keyrings = {};
    this.unsupportedKeyrings = [];
  }

  fullUpdate() {
    this.emit("update", this.memStore);
    return this.memStore;
  }

  async exportAccount(address: string): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringControllerError.UnsupportedExportAccount);
    }

    return await keyring.exportAccount(address.toLowerCase());
  }

  async removeAccount(address: Hex): Promise<KeyringControllerState> {
    const keyring = await this.getKeyringForAccount(address);

    // Not all the keyrings support this, so we have to check
    if (!keyring.removeAccount) {
      throw new Error(KeyringControllerError.UnsupportedRemoveAccount);
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);

    return this.fullUpdate();
  }

  async getAccounts(keyring = "root"): Promise<string[]> {
    return this.keyrings[keyring].getAccounts();
  }

  async getKeyringForAccount(address: string) {
    if (Object.keys(this.keyrings).includes(address)) {
      return this.keyrings[address];
    }
    return this.keyrings.root;
  }

  async signTransaction(
    tideTx: unknown,
    rawAddress: string,
    opts: Record<string, unknown> = {}
  ): Promise<unknown> {
    const address = rawAddress.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signTransaction) {
      throw new Error(KeyringControllerError.UnsupportedSignTransaction);
    }

    return await keyring.signTransaction(address, tideTx, opts);
  }

  async signMessage(
    msgParams: {
      from: string;
      data: string;
    },
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signMessage) {
      throw new Error(KeyringControllerError.UnsupportedSignMessage);
    }

    return await keyring.signMessage(address, msgParams.data, opts);
  }

  async signPersonalMessage(
    msgParams: {
      from: string;
      data: string;
    },
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const address = msgParams.from.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.signPersonalMessage) {
      throw new Error(KeyringControllerError.UnsupportedSignPersonalMessage);
    }

    const normalizedData = msgParams.data.toLowerCase() as Hex;

    return await keyring.signPersonalMessage(address, normalizedData, opts);
  }

  async getEncryptionPublicKey(
    address: string,
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const normalizedAddress = address.toLowerCase() as Hex;
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.getEncryptionPublicKey) {
      throw new Error(KeyringControllerError.UnsupportedGetEncryptionPublicKey);
    }

    return await keyring.getEncryptionPublicKey(normalizedAddress, opts);
  }
}

export default new KeyringController();
