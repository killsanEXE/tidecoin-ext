import { Buffer } from "buffer";

export type Base58String = string;

export interface PrivateKeyOptions {
  depth: number;
  parentFingerPrint: number;
  childIndex: number;
  chainCode: Buffer;
  privateKey: Buffer;
}

export interface PublicKeyOptions
  extends Omit<PrivateKeyOptions, "privateKey"> {
  xkey: Base58String;
  publicKey: Buffer;
}
