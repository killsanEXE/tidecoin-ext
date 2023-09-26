import * as tidecoin from "tidecoinjs-lib";
import { EventEmitter } from "events";
import HDPrivateKey from "test-test-test-hd-wallet/src/hd/private";
import storageService from "./storage";
import { falconPairFactory } from "tidepair";
import {
  hexToBytes as fromHex,
  bytesToHex as toHex,
} from "@noble/hashes/utils";

import { ADDRESS_TYPES, KEYRING_TYPE } from "@/shared/constant";
import { AddressType } from "@/shared/types";
import { IWallet } from "@/shared/interfaces";

const falconPair = falconPairFactory();

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

class KeyringService extends EventEmitter {
  storage = storageService;
  state: IWallet[];
  keyrings: HDPrivateKey[];
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

  getKeyringForAccount(accountPublicKey: string) {
    if (!this.state.length) {
      throw new Error("State not initialized");
    }
    let address: string | undefined = undefined;

    for (const i of this.state) {
      const acc = i.accounts.find((i) => i.address === accountPublicKey);
      if (acc) {
        address = acc.privateKey;
        break;
      }
    }
    if (!address) throw new Error("Account not founded");

    return falconPair.fromPrivateKey(Buffer.from(fromHex(address)));
  }

  signTransaction(
    psbt: tidecoin.Psbt,
    inputs: (ToSignInput & { sighashTypes?: number[] })[]
  ) {
    inputs.forEach((i) => {
      const keypair = this.getKeyringForAccount(i.publicKey);
      const pair = falconPair.fromPrivateKey(keypair.privateKey);
      psbt.signInput(i.index, pair, i.sighashTypes);
    });
    return psbt;
  }

  signMessage(address: string, data: string) {
    const keyring = this.getKeyringForAccount(address);
    const sig = keyring.sign(
      Buffer.from(new TextEncoder().encode(data)),
      window.crypto.getRandomValues(new Uint8Array(48))
    );
    return toHex(sig);
  }

  verifyMessage(address: string, data: string, sig: string) {
    const keyring = this.getKeyringForAccount(address);
    const result = keyring.verify(
      Buffer.from(fromHex(data)),
      Buffer.from(fromHex(sig))
    );
    return result;
  }
}

export default new KeyringService();
