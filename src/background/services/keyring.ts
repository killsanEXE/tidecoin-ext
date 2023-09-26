import * as tidecoin from "tidecoinjs-lib";
import { EventEmitter } from "events";
import log from "loglevel";
import HDPrivateKey from "test-test-test-hd-wallet/src/hd/private";
import storageService from "./storage";

import { ADDRESS_TYPES, KEYRING_TYPE } from "@/shared/constant";
import { AddressType } from "@/shared/types";
import { IWallet } from "@/shared/interfaces";

interface MemStoreState {
  isUnlocked: boolean;
  keyringTypes: any[];
  keyrings: any[];
  preMnemonics: string;
}

export interface DisplayedKeyring {
  type: string;
  accounts: {
    pubkey: string;
    brandName: string;
    type?: string;
    keyring?: HDPrivateKey;
    alianName?: string;
  }[];
  keyring: HDPrivateKey;
  addressType: AddressType;
  index: number;
}
export interface ToSignInput {
  index: number;
  publicKey: string;
}
export interface Keyring {
  type: string;
  serialize(): Promise<any>;
  deserialize(opts: any): Promise<void>;
  addAccounts(n: number): Promise<string[]>;
  getAccounts(): Promise<string[]>;
  signTransaction(
    psbt: tidecoin.Psbt,
    inputs: ToSignInput[]
  ): Promise<tidecoin.Psbt>;
  signMessage(address: string, message: string): Promise<string>;
  verifyMessage(
    address: string,
    message: string,
    sig: string
  ): Promise<boolean>;
  exportAccount(address: string): Promise<string>;
  removeAccount(address: string): void;

  accounts?: string[];
  unlock?(): Promise<void>;
  getFirstPage?(): Promise<{ address: string; index: number }[]>;
  getNextPage?(): Promise<{ address: string; index: number }[]>;
  getPreviousPage?(): Promise<{ address: string; index: number }[]>;
  getAddresses?(
    start: number,
    end: number
  ): { address: string; index: number }[];
  getIndexByAddress?(address: string): number;

  getAccountsWithBrand?(): { address: string; index: number }[];
  activeAccounts?(indexes: number[]): string[];

  changeHdPath?(hdPath: string): void;
  getAccountByHdPath?(hdPath: string, index: number): string;
}

class EmptyKeyring implements Keyring {
  type = KEYRING_TYPE.Empty;
  constructor() {
    // todo
  }
  async addAccounts(n: number): Promise<string[]> {
    return [];
  }

  async getAccounts(): Promise<string[]> {
    return [];
  }
  signTransaction(
    psbt: tidecoin.Psbt,
    inputs: ToSignInput[]
  ): Promise<tidecoin.Psbt> {
    throw new Error("Method not implemented.");
  }
  signMessage(address: string, message: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  verifyMessage(
    address: string,
    message: string,
    sig: string
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  exportAccount(address: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  removeAccount(address: string): void {
    throw new Error("Method not implemented.");
  }

  async serialize() {
    return "";
  }

  async deserialize(opts: any) {
    return;
  }
}

class KeyringService extends EventEmitter {
  //
  // PUBLIC METHODS
  //
  storage = storageService;
  state: IWallet[];
  keyrings: Keyring[];
  addressTypes: AddressType[];
  password: string | null = null;

  constructor() {
    super();
    this.keyrings = [];
    this.addressTypes = [];
    this.state = [];
  }

  async boot(password: string) {
    this.password = password;
    this.state = await this.storage.importWallets(this.password);
  }

  importPrivateKey = async (privateKey: string, addressType: AddressType) => {
    await this.persistAllKeyrings();
    const keyring = await this.addNewKeyring(
      "Simple Key Pair",
      [privateKey],
      addressType
    );
    await this.persistAllKeyrings();
    this.setUnlocked();
    return keyring;
  };

  private generateMnemonic = (): string => {
    return bip39.generateMnemonic(128);
  };

  removePreMnemonics = () => {
    this.memStore.updateState({ preMnemonics: "" });
  };

  getPreMnemonics = async (): Promise<any> => {
    if (!this.memStore.getState().preMnemonics) {
      return "";
    }

    if (!this.password) {
      throw new Error(i18n.t("you need to unlock wallet first"));
    }

    return await this.encryptor.decrypt(
      this.password,
      this.memStore.getState().preMnemonics
    );
  };

  createKeyringWithMnemonics = async (
    seed: string,
    hdPath: string,
    passphrase: string,
    addressType: AddressType,
    accountCount: number
  ) => {
    if (!bip39.validateMnemonic(seed)) {
      return Promise.reject(new Error(i18n.t("mnemonic phrase is invalid")));
    }

    await this.persistAllKeyrings();
    const activeIndexes: number[] = [];
    for (let i = 0; i < accountCount; i++) {
      activeIndexes.push(i);
    }
    const keyring = await this.addNewKeyring(
      "HD Key Tree",
      {
        mnemonic: seed,
        activeIndexes,
        hdPath,
        passphrase,
      },
      addressType
    );
    const accounts = await keyring.getAccounts();
    if (!accounts[0]) {
      throw new Error("KeyringController - First Account not found.");
    }
    this.persistAllKeyrings();
    this.setUnlocked();
    this.fullUpdate();
    return keyring;
  };

  async addNewAccount(selectedKeyring: Keyring): Promise<string[]> {
    const accounts = await selectedKeyring.addAccounts(1);
    accounts.forEach((hexAccount) => {
      this.emit("newAccount", hexAccount);
    });
    return accounts;
  }

  async exportAccount(address: string): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    const privkey = await keyring.exportAccount(address);
    return privkey;
  }

  async removeAccount(address: string, type: string): Promise<any> {
    const keyring = await this.getKeyringForAccount(address, type);

    if (typeof keyring.removeAccount != "function") {
      throw new Error(
        `Keyring ${keyring.type} doesn't support account removal operations`
      );
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
  }

  async removeKeyring(keyringIndex: number): Promise<any> {
    delete this.keyrings[keyringIndex];
    this.keyrings[keyringIndex] = new EmptyKeyring();
    await this.persistAllKeyrings();
    await this._updateMemStoreKeyrings();
    await this.fullUpdate();
  }

  async signTransaction(
    keyring: Keyring,
    psbt: tidecoin.Psbt,
    inputs: ToSignInput[]
  ) {
    return await keyring.signTransaction(psbt, inputs);
  }

  async signMessage(address: string, data: string) {
    const keyring = await this.getKeyringForAccount(address);
    const sig = await keyring.signMessage(address, data);
    return sig;
  }

  async verifyMessage(address: string, data: string, sig: string) {
    const keyring = await this.getKeyringForAccount(address);
    const result = await keyring.verifyMessage(address, data, sig);
    return result;
  }
}

export default new KeyringService();
