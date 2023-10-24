import { ApiUTXO } from "@/shared/interfaces/api";
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

export interface SendTDC {
  to: string;
  amount: number;
  utxos: ApiUTXO[];
  receiverToPayFee: boolean;
  feeRate: number;
}
