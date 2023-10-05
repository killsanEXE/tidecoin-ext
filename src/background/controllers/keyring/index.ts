// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import { EventEmitter } from "events";

import { KeyringControllerError } from "./consts";
import { Hex, Json, Keyring } from "./types";
import { SimpleKey, HDPrivateKey } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { storageService } from "..";
import { Psbt } from "tidecoinjs-lib";

export const KEYRING_SDK_TYPES = {
  SimpleKey,
  HDPrivateKey,
};

class KeyringController extends EventEmitter {
  public keyrings: Record<string | "root", Keyring<Json>>;

  constructor() {
    super();

    this.keyrings = {};
  }

  async init(password: string) {
    const wallets = await storageService.importWallets(password);
    wallets.forEach((i) => {
      const wallet = HDPrivateKey.fromMnemonic(Mnemonic.fromPhrase(i.phrase!));
      if (i.accounts.length > 1) {
        wallet.addAccounts(i.accounts.length - 1);
      }
      this.keyrings[i.id] = wallet;
    });

    return wallets;
  }

  /**
   * Method export private key of selected account
   * @param address P2WPKH address of account
   * @returns {string} WIF representation of private key
   */
  async exportAccount(address: Hex): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringControllerError.UnsupportedExportAccount);
    }

    return await keyring.exportAccount(address);
  }

  async removeAccount(address: Hex) {
    const keyring = await this.getKeyringForAccount(address);

    if (!keyring.removeAccount) {
      throw new Error(KeyringControllerError.UnsupportedRemoveAccount);
    }
    keyring.removeAccount(address);
    this.emit("removedAccount", address);
  }

  async getAccounts(keyring = "root"): Promise<string[]> {
    return this.keyrings[keyring].getAccounts();
  }

  async getKeyringForAccount(address: Hex) {
    if (Object.keys(this.keyrings).includes(address)) {
      return this.keyrings[address];
    }
    return this.keyrings.root;
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

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return await keyring.signPersonalMessage(
      msgParams.from,
      msgParams.data,
      randomSeed
    );
  }

  async getEncryptionPublicKey(
    address: string,
    opts: Record<string, unknown> = {}
  ): Promise<string> {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.getEncryptionPublicKey) {
      throw new Error(KeyringControllerError.UnsupportedGetEncryptionPublicKey);
    }

    return await keyring.getEncryptionPublicKey(address, opts);
  }

  private async _signTransactionMultisig() {
    throw new Error("Unimplemented");

    // TODO It's a base to develop multisign wallets
    // const keyring = await this.getKeyringForAccount("");
    // const addresses = await keyring.getAccounts();
    // const utxos = (await Promise.all(addresses.map(apiController.getUtxos)))
    //   .filter((i) => i !== undefined)
    //   .reduce((prev, cur) => prev?.concat(...(cur ?? [])), []) as ApiUTXO[];
  }
}

export default new KeyringController();
