import { ripemd160 } from "@noble/hashes/ripemd160";
import { PRIVKEY_SIZE, PUBKEY_SIZE } from "../protocol/policy";
import HDPrivateKey from "./private";
import HDPublicKey from "./public";
import { sha256 } from "@noble/hashes/sha256";
import { lru } from "tiny-lru";
import { Buffer } from "buffer";

export const MIN_ENTROPY: number = 384;
export const MAX_ENTROPY: number = 512;
export const ZERO_KEY: Buffer = Buffer.alloc(PUBKEY_SIZE, 0x00);
export const ZERO_PRIVKEY: Buffer = Buffer.alloc(PRIVKEY_SIZE, 0x00);

export const hash160 = (value: string | Uint8Array) =>
  Buffer.from(ripemd160(sha256(value)));
export const hash256 = (value: string | Uint8Array) =>
  Buffer.from(sha256(sha256(value)));
export const assert = (exp: boolean | number, message?: string) => {
  if (exp) return true;
  throw new Error(message);
};

export const cache = lru<HDPublicKey | HDPrivateKey>(500);

export function parsePath(path: string): number[] {
  const parts = path.split("/");
  const root = parts[0];

  if (root !== "m" && root !== "M" && root !== "m'" && root !== "M'") {
    throw new Error("Invalid path root.");
  }

  const result = [];

  for (let i = 1; i < parts.length; i++) {
    let part = parts[i];

    if (part.length > 10) throw new Error("Path index too large.");

    if (!/^\d+$/.test(part)) throw new Error("Path index is non-numeric.");

    let index = parseInt(part, 10);

    if (index >>> 0 !== index) throw new Error("Path index out of range.");

    result.push(index);
  }

  return result;
}

export const isMaster = function isMaster(
  key: HDPrivateKey | HDPublicKey
): boolean {
  return key.depth === 0 && key.childIndex === 0 && key.parentFingerPrint === 0;
};

export const isAccount = function isAccount(
  key: HDPrivateKey | HDPublicKey,
  account?: number
): boolean {
  if (account != null) {
    const index = account >>> 0;
    if (key.childIndex !== index) return false;
  }
  return key.depth === 3 && key.childIndex !== 0;
};
