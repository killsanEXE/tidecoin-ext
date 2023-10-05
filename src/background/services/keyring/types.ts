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
