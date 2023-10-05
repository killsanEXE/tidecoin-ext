// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import { KeyringServiceError } from "./consts";
import { Hex, Json, SendTDC } from "./types";
import { SimpleKey, HDPrivateKey, Mnemonic } from "test-test-test-hd-wallet";
import { storageService } from "@/background/services";
import { Psbt, networks, payments } from "tidecoinjs-lib";
import { Keyring } from "test-test-test-hd-wallet/src/hd/types";
import { createSendTidecoin } from "tidecoin-utils";
import { AddressType } from "@/shared/types";

export const KEYRING_SDK_TYPES = {
  SimpleKey,
  HDPrivateKey,
};

class KeyringService {
  private keyrings: Keyring<Json>[];

  constructor() {
    this.keyrings = [];
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

  newWallet(phrase: string) {
    const keyring = HDPrivateKey.fromMnemonic(Mnemonic.fromPhrase(phrase));
    return payments.p2wpkh({ pubkey: Buffer.from(keyring.publicKey) }).address;
  }

  /**
   * Method export private key of selected account
   * @param {Hex} address P2WPKH address of account
   * @returns {string} WIF representation of private key
   */
  exportAccount(address: Hex): string {
    const keyring = this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringServiceError.UnsupportedExportAccount);
    }

    return keyring.exportAccount(address);
  }

  getAccounts(address: Hex) {
    for (const i of this.keyrings) {
      const accounts = i.getAccounts();
      if (accounts.includes(address)) {
        return accounts;
      }
    }
    throw new Error("Account not found");
  }

  getKeyringForAccount(address: Hex) {
    for (const i of this.keyrings) {
      const accounts = i.getAccounts();
      if (accounts.includes(address)) return i;
    }

    throw new Error("Keyring not found");
  }

  signTransaction(tideTx: Psbt, address: string) {
    const keyring = this.getKeyringForAccount(address);

    keyring.signTransaction(
      tideTx,
      tideTx.data.inputs.map((_i, index) => ({
        index: index,
        address: address,
      }))
    );
  }

  signMessage(msgParams: { from: string; data: string }) {
    const keyring = this.getKeyringForAccount(msgParams.from);

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return keyring.signMessage(msgParams.from, msgParams.data, randomSeed);
  }

  signPersonalMessage(msgParams: { from: string; data: string }) {
    const keyring = this.getKeyringForAccount(msgParams.from);
    if (!keyring.signPersonalMessage) {
      throw new Error(KeyringServiceError.UnsupportedSignPersonalMessage);
    }

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return keyring.signPersonalMessage(
      msgParams.from,
      msgParams.data,
      randomSeed
    );
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

  private getPubKey(address: Hex) {
    const keyring = this.getKeyringForAccount(address);
    return keyring.exportPublicKey(address);
  }

  async sendTDC(data: SendTDC) {
    const account = storageService.walletState.currentWallet?.currentAccount;
    if (!account || !account.address)
      throw new Error("Error when trying to get the current account");

    const psbt = await createSendTidecoin({
      utxos: data.utxos.map((v) => {
        return {
          txId: v.mintTxid,
          outputIndex: v.mintIndex,
          satoshis: v.value,
          scriptPk: v.script,
          addressType: AddressType.P2WPKH,
          address: v.address,
          ords: [],
        };
      }),
      toAddress: data.to,
      toAmount: data.amount,
      signTransaction: async (tx) => this.signTransaction(tx, account.address!),
      network: networks.TIDECOIN,
      changeAddress: account.address,
      receiverToPayFee: data.receiverToPayFee,
      pubkey: this.getPubKey(account.address),
      feeRate: data.feeRate,
      enableRBF: false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore We are really dont know what is it but we still copy working code
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    return psbt.toHex();
  }
}

export default new KeyringService();
