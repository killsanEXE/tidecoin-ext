// forked from https://github.com/MetaMask/KeyringController/blob/main/src/KeyringController.ts

import { KeyringServiceError } from "./consts";
import { Hex, Json, SendTDC } from "./types";
import { SimpleKey, HDPrivateKey, Mnemonic } from "test-test-test-hd-wallet";
import { storageService } from "@/background/services";
import { Psbt, Transaction, networks } from "tidecoinjs-lib";
import { AddressType, Keyring, TideInput } from "test-test-test-hd-wallet/src/hd/types";
import { createSendTidecoin } from "tidecoin-utils";
import HDSimpleKey from "test-test-test-hd-wallet/src/hd/simple";
import { UTXOAddressType } from "tidecoin-utils/lib/OrdTransaction";
import { getScriptForAddress } from "@/shared/utils/transactions";
import { fromOutputScript } from "tidecoinjs-lib/src/address";

export const KEYRING_SDK_TYPES = {
  SimpleKey,
  HDPrivateKey,
};

class KeyringService {
  keyrings: Keyring<Json>[];

  constructor() {
    this.keyrings = [];
  }

  async init(password: string) {
    const wallets = await storageService.importWallets(password);
    for (const i of wallets) {
      let wallet: HDPrivateKey | SimpleKey;
      if (i.data.seed) {
        wallet = await HDPrivateKey.deserialize(i.data);
        if (i.accounts.length > 1) {
          await wallet.addAccounts(i.accounts.length - 1);
        }
      } else {
        wallet = (await HDSimpleKey.deserialize(i.data)) as any as HDSimpleKey;
      }
      this.keyrings[i.id] = wallet;
    }

    return wallets;
  }

  async newKeyring(type: "simple" | "root", payload: string, addressType: AddressType = AddressType.P2WPKH) {
    let keyring: HDPrivateKey | HDSimpleKey;
    if (type === "root") {
      keyring = await HDPrivateKey.fromMnemonic(Mnemonic.fromPhrase(payload));
    } else {
      keyring = await HDSimpleKey.deserialize({
        privateKey: payload,
        addressType: addressType,
      });
    }
    keyring.addressType = typeof addressType === "number" ? addressType : AddressType.P2WPKH;
    this.keyrings.push(keyring);
    return keyring.getAddress(keyring.publicKey);
  }

  async exportAccount(address: Hex) {
    const keyring = await this.getKeyringForAccount(address);
    if (!keyring.exportAccount) {
      throw new Error(KeyringServiceError.UnsupportedExportAccount);
    }

    return await keyring.exportAccount(address);
  }

  async getAccounts(address: Hex) {
    for (const i of this.keyrings) {
      const accounts = await i.getAccounts();
      if (accounts.includes(address)) {
        return accounts;
      }
    }
    throw new Error("Account not found");
  }

  async getKeyringForAccount(address: Hex) {
    for (const i of this.keyrings) {
      const accounts = await i.getAccounts();
      if (accounts.includes(address)) return i;
    }

    throw new Error("Keyring not found");
  }

  getKeyringByIndex(index: number) {
    if (index + 1 > this.keyrings.length) {
      throw new Error("Invalid keyring index");
    }
    return this.keyrings[index];
  }

  async serializeById(index: number): Promise<any> {
    return await this.keyrings[index].serialize();
  }

  async signTransaction(tideTx: Psbt, address: string) {
    const keyring = await this.getKeyringForAccount(address);
    keyring.signTransaction(
      tideTx,
      tideTx.data.inputs.map((_i, index) => ({
        index: index,
        address: address,
      }))
    );
  }

  async signMessage(msgParams: { from: string; data: string }) {
    const keyring = await this.getKeyringForAccount(msgParams.from);
    const randomSeed = crypto.getRandomValues(new Uint8Array(48));
    return keyring.signMessage(msgParams.from, msgParams.data, randomSeed);
  }

  async signPersonalMessage(msgParams: { from: string; data: string }) {
    const keyring = await this.getKeyringForAccount(msgParams.from);
    if (!keyring.signPersonalMessage) {
      throw new Error(KeyringServiceError.UnsupportedSignPersonalMessage);
    }

    const randomSeed = crypto.getRandomValues(new Uint8Array(48));

    return keyring.signPersonalMessage(msgParams.from, msgParams.data, randomSeed);
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

  async exportPublicKey(address: Hex) {
    const keyring = await this.getKeyringForAccount(address);
    return await keyring.exportPublicKey(address);
  }

  async sendTDC(data: SendTDC) {
    const account = storageService.currentAccount;
    const wallet = storageService.currentWallet;
    if (!account || !account.address) throw new Error("Error when trying to get the current account");

    const publicKey = await this.exportPublicKey(account.address);

    const psbt = await createSendTidecoin({
      utxos: data.utxos.map((v) => {
        return {
          txId: v.txid,
          outputIndex: v.vout,
          satoshis: v.value,
          scriptPk: getScriptForAddress(Buffer.from(publicKey, "hex"), wallet.addressType).toString("hex"),
          addressType: wallet?.addressType as any as UTXOAddressType,
          address: account.address,
          ords: [],
        };
      }),
      toAddress: data.to,
      toAmount: data.amount,
      signTransaction: async (tx) => this.signTransaction(tx, account.address),
      network: networks.TIDECOIN,
      changeAddress: account.address,
      receiverToPayFee: data.receiverToPayFee,
      pubkey: await this.exportPublicKey(account.address),
      feeRate: data.feeRate,
      enableRBF: false,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore We are really dont know what is it but we still copy working code
    psbt.__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    return psbt.toHex();
  }

  async changeAddressType(index: number, addressType: AddressType): Promise<string[]> {
    this.keyrings[index].addressType = addressType;
    return await this.keyrings[index].getAccounts();
  }

  async deleteWallet(id: number) {
    this.keyrings.splice(id, 1);
    let wallets = [...storageService.walletState.wallets];
    wallets.splice(id, 1);
    wallets = wallets.map((f, i) => ({ ...f, id: i }));
    await storageService.saveWallets(storageService.appState.password, wallets);
    return wallets;
  }

  formatOptionsToSignInputs = (_psbt: string | Psbt) => {
    const account = storageService.currentAccount;
    if (!account) throw null;

    const toSignInputs: TideInput[] = [];

    const psbt =
      typeof _psbt === "string" ? Psbt.fromHex(_psbt as string, { network: networks.TIDECOIN }) : (_psbt as Psbt);
    psbt.data.inputs.forEach((v, index) => {
      let script: any = null;
      if (v.witnessUtxo) {
        script = v.witnessUtxo.script;
      } else if (v.nonWitnessUtxo) {
        const tx = Transaction.fromBuffer(v.nonWitnessUtxo);
        const output = tx.outs[psbt.txInputs[index].index];
        script = output.script;
      }
      const isSigned = v.finalScriptSig || v.finalScriptWitness;
      if (script && !isSigned) {
        const address = fromOutputScript(script, networks.TIDECOIN);
        if (account.address === address) {
          toSignInputs.push({
            index,
            address: account.address,
            sighashTypes: v.sighashType ? [v.sighashType] : undefined,
          });
        }
      }
    });
    return toSignInputs;
  };
}

export default new KeyringService();
