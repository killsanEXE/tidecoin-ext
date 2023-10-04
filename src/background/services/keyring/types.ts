import { TideInput } from "test-test-test-hd-wallet/src/hd/types";
import { Psbt } from "tidecoinjs-lib";
import * as encryptorUtils from "@metamask/browser-passworder";

export type Json = any;
export type Hex = string;

export interface KeyringControllerArgs {
  encryptor?: typeof encryptorUtils;
}

export type Eip1024EncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export type Keyring<State extends Json> = {
  type: string;
  getAccounts(): Promise<Hex[]>;
  addAccounts(number: number): Promise<Hex[]>;
  serialize(): Promise<State>;
  deserialize(state: State): Promise<void>;
  removeAccount?(address: Hex): void;
  exportAccount?(
    address: Hex,
    options?: Record<string, unknown>
  ): Promise<string>;
  getAppKeyAddress?(address: Hex, origin: string): Promise<Hex>;
  signTransaction(psbt: Psbt, inputs: TideInput[]): Promise<unknown>;
  signMessage(address: Hex, message: string, seed: Uint8Array): Promise<string>;
  signPersonalMessage?(
    address: Hex,
    message: Hex,
    seed: Uint8Array
  ): Promise<string>;
  signTypedData?(
    address: Hex,
    typedData: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<string>;
  getEncryptionPublicKey?(
    account: Hex,
    options?: Record<string, unknown>
  ): Promise<string>;
  decryptMessage?(
    account: Hex,
    encryptedData: Eip1024EncryptedData
  ): Promise<string>;
  generateRandomMnemonic?(): void;
  destroy?(): Promise<void>;
};
