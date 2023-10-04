// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import * as encryptorUtils from "@metamask/browser-passworder";
import { EventEmitter } from "events";

import { KeyringControllerError } from "./consts";
import { Hex, Json, Keyring, KeyringControllerArgs } from "./types";
import { SimpleKey, HDPrivateKey } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { storageService } from "..";
import { Psbt } from "tidecoinjs-lib";

export const KEYRING_SDK_TYPES = {
  SimpleKey,
  HDPrivateKey,
};

class KeyringController extends EventEmitter {
  public encryptor: typeof encryptorUtils;

  public keyrings: Record<string | "root", Keyring<Json>>;

  public password?: string;

  public isUnlocked?: boolean;

  constructor(options?: KeyringControllerArgs) {
    super();

    this.isUnlocked = false;
    this.encryptor = options?.encryptor ?? encryptorUtils;
    this.keyrings = {};
  }

  async init(password: string) {
    this.password = password;
    this.isUnlocked = true;

    const wallets = await storageService.importWallets(password);
    wallets.forEach((i) => {
      const wallet = HDPrivateKey.fromMnemonic(Mnemonic.fromPhrase(i.phrase));
      if (i.accounts.length > 1) {
        wallet.addAccounts(i.accounts.length - 1);
      }
      this.keyrings[i.id] = wallet;
    });

    return wallets;
  }

  async exportAccount(address: string): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringControllerError.UnsupportedExportAccount);
    }

    return await keyring.exportAccount(address.toLowerCase());
  }

  async removeAccount(address: Hex) {
    const keyring = await this.getKeyringForAccount(address);

    // Not all the keyrings support this, so we have to check
    if (!keyring.removeAccount) {
      throw new Error(KeyringControllerError.UnsupportedRemoveAccount);
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);
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

  private async _signTransactionMultisig() {
    // TODO It is base to develop multisign wallets
    throw new Error("Unimplemented");
    // const keyring = await this.getKeyringForAccount("");
    // const addresses = await keyring.getAccounts();
    // const utxos = (await Promise.all(addresses.map(apiController.getUtxos)))
    //   .filter((i) => i !== undefined)
    //   .reduce((prev, cur) => prev?.concat(...(cur ?? [])), []) as ApiUTXO[];
  }

  async signTransaction(tideTx: Psbt, address: string): Promise<unknown> {
    const keyring = await this.getKeyringForAccount(address);

    return await keyring.signTransaction(
      tideTx,
      tideTx.data.inputs.map((_i, index) => ({
        index: index,
        address: address,
      }))
    );
  }

  async signMessage(msgParams: {
    from: string;
    data: string;
  }): Promise<string> {
    const keyring = await this.getKeyringForAccount(msgParams.from);

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return await keyring.signMessage(
      msgParams.from,
      msgParams.data,
      randomSeed
    );
  }

  async signPersonalMessage(msgParams: {
    from: string;
    data: string;
  }): Promise<string> {
    const keyring = await this.getKeyringForAccount(msgParams.from);
    if (!keyring.signPersonalMessage) {
      throw new Error(KeyringControllerError.UnsupportedSignPersonalMessage);
    }

    const normalizedData = msgParams.data.toLowerCase() as Hex;

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return await keyring.signPersonalMessage(
      msgParams.from,
      normalizedData,
      randomSeed
    );
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
