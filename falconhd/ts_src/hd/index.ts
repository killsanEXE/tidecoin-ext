import { NetType } from "../protocol/types";
import Mnemonic from "./mnemonic";
import HDPrivateKey from "./private";
import HDPublicKey from "./public";
import { Buffer } from "buffer";

export function fromBase58(xkey: string, network?: NetType) {
  if (HDPrivateKey.isBase58(xkey))
    return HDPrivateKey.fromBase58(xkey, network);
  return HDPublicKey.fromBase58(xkey, network);
}

export function generate(): HDPrivateKey {
  return HDPrivateKey.generate();
}

export function fromSeed(options: Buffer): HDPrivateKey {
  return HDPrivateKey.fromSeed(options);
}

export function fromMnemonic(options: Mnemonic): HDPrivateKey {
  return HDPrivateKey.fromMnemonic(options);
}

export function fromJSON(
  json: { xprivkey?: string; xpubkey?: string },
  network?: NetType
): HDPrivateKey | HDPublicKey {
  if (json.xprivkey) return HDPrivateKey.fromJSON(json, network);
  return HDPublicKey.fromJSON({ xpubkey: json.xpubkey! }, network);
}

export function fromRaw(
  data: Buffer,
  network?: NetType
): HDPrivateKey | HDPublicKey {
  if (HDPrivateKey.isRaw(data, network))
    return HDPrivateKey.fromRaw(data, network);
  return HDPublicKey.fromRaw(data, network);
}

export function from(
  options: any,
  network?: NetType
): HDPrivateKey | HDPublicKey {
  if (options instanceof HDPublicKey || options instanceof HDPrivateKey)
    return options;

  if (isBase58(options, network!)) return fromBase58(options, network);

  if (isRaw(options, network!)) return fromRaw(options, network);

  if (options && typeof options === "object") return fromMnemonic(options);

  throw new Error("Cannot create HD key from bad options.");
}

export function isBase58(data: string, network?: NetType): boolean {
  return (
    HDPrivateKey.isBase58(data, network) || HDPublicKey.isBase58(data, network)
  );
}

export function isRaw(data: Buffer, network?: NetType): boolean {
  return HDPrivateKey.isRaw(data, network) || HDPublicKey.isRaw(data, network);
}
