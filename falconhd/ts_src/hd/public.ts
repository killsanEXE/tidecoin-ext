import { Base58String, PublicKeyOptions } from "./types";
import { ZERO_FALCON_HASH } from "../protocol/consensus";
import {
  ZERO_KEY,
  assert,
  cache,
  hash160,
  hash256,
  isAccount,
  isMaster,
  parsePath,
} from "./common";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { sha512 } from "@noble/hashes/sha512";
import { PUBKEY_SIZE } from "../protocol/policy";
import * as bs58 from "bs58";
import { NetType } from "../protocol/types";
import Network from "../protocol/network";
import { BufferReader, StaticWriter, pool, read, write } from "@jil/bufio";
import { falconKeypair } from "rust-falcon";
import { Buffer } from "buffer";

class HDPublicKey {
  depth: number = 0;
  parentFingerPrint: number = 0;
  childIndex: number = 0;
  chainCode: Buffer = ZERO_FALCON_HASH;
  publicKey: Buffer = ZERO_KEY;

  fingerPrint = -1;

  constructor(options?: PublicKeyOptions) {
    if (options) this.fromOptions(options);
  }

  fromOptions(options: PublicKeyOptions): HDPublicKey {
    if (options.depth) this.depth = options.depth;
    if (options.parentFingerPrint)
      this.parentFingerPrint = options.parentFingerPrint;
    if (options.childIndex) this.childIndex = options.childIndex;
    if (options.chainCode) this.chainCode = options.chainCode;
    if (options.publicKey) this.publicKey = options.publicKey;

    return this;
  }

  static fromOptions(options: PublicKeyOptions): HDPublicKey {
    return new this().fromOptions(options);
  }

  toPublic(): HDPublicKey {
    return this;
  }

  xpubkey(network?: NetType): Base58String {
    return this.toBase58(network);
  }

  /**
   * Destroy the key (zeroes chain code and pubkey).
   */

  destroy() {
    this.depth = 0;
    this.childIndex = 0;
    this.parentFingerPrint = 0;

    this.chainCode = ZERO_FALCON_HASH;
    this.publicKey = ZERO_KEY;

    this.fingerPrint = -1;
  }

  derive(index: number): HDPublicKey {
    if (index >>> 0 !== index) throw new Error("Index out of range.");

    if (this.depth >= 0xff) throw new Error("Depth too high.");

    const id = this.getID(index);
    const cacheValue = cache.get(id) as HDPublicKey;

    if (cacheValue) return cacheValue;

    const bw = pool(PUBKEY_SIZE + 4);

    bw.writeBytes(this.publicKey);
    bw.writeU32BE(index);

    const data = bw.render();

    //const hash = sha512.mac(data, this.chainCode);
    const hash = Buffer.from(
      pbkdf2(sha512, data, this.chainCode, {
        c: 50000,
        dkLen: 96,
      })
    );
    const left = hash.subarray(0, 48);
    const right = hash.subarray(48, 96);

    let keys;
    try {
      //let seed = Buffer.alloc(48,0x00);
      //left.copy(seed,0,0,32);
      //keys=falcon.generateKeypair(seed);
      keys = falconKeypair(left);
    } catch (e) {
      return this.derive(index + 1);
    }

    if (this.fingerPrint === -1) {
      const fp = Buffer.from(hash160(this.publicKey));
      this.fingerPrint = fp.readUInt32BE(0);
    }

    const child = new HDPublicKey();
    child.depth = this.depth + 1;
    child.parentFingerPrint = this.fingerPrint;
    child.childIndex = index;
    child.chainCode = right;
    child.publicKey = Buffer.concat([Buffer.from([0x07]), keys.public]);

    cache.set(id, child);

    return child;
  }

  getID(index: number): string {
    return "b" + this.publicKey.toString("hex") + index;
  }

  deriveAccount(account: number): HDPublicKey {
    assert(this.isAccount(account), "Cannot derive account index.");
    return this;
  }

  isMaster(): boolean {
    return isMaster(this);
  }

  isAccount(account?: number): boolean {
    return isAccount(this, account);
  }

  static isValidPath(path: string): boolean {
    try {
      parsePath(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  derivePath(path: string): HDPublicKey {
    const indexes = parsePath(path);

    let key: any = this;

    for (const index of indexes) key = key.derive(index);

    return key;
  }

  equals(obj: HDPublicKey): boolean {
    return (
      this.depth === obj.depth &&
      this.parentFingerPrint === obj.parentFingerPrint &&
      this.childIndex === obj.childIndex &&
      this.chainCode.equals(obj.chainCode) &&
      this.publicKey.equals(obj.publicKey)
    );
  }

  compare(key: PublicKeyOptions): number | undefined {
    if (key.depth === undefined) return;
    let cmp = this.depth - key.depth;

    if (cmp !== 0) return cmp;

    if (key.parentFingerPrint === undefined) return;
    cmp = this.parentFingerPrint - key.parentFingerPrint;

    if (cmp !== 0) return cmp;

    if (key.childIndex === undefined) return;
    cmp = this.childIndex - key.childIndex;

    if (cmp !== 0) return cmp;

    if (!key.chainCode) return;
    cmp = this.chainCode.compare(key.chainCode);

    if (cmp !== 0) return cmp;

    if (!key.publicKey) return;
    cmp = this.publicKey.compare(key.publicKey);

    if (cmp !== 0) return cmp;

    return 0;
  }

  toJSON(network?: NetType) {
    return {
      xpubkey: this.xpubkey(network),
    };
  }

  fromJSON(json: { xpubkey: string }, network?: NetType): HDPublicKey {
    this.fromBase58(json.xpubkey, network);
    return this;
  }

  static fromJSON(json: { xpubkey: string }, network?: NetType): HDPublicKey {
    return new this().fromJSON(json, network);
  }

  static isBase58(data: string, network?: NetType): boolean {
    if (typeof data !== "string") return false;

    if (data.length < 4) return false;

    const prefix = data.substring(0, 4);

    try {
      Network.fromPublic58(prefix, network);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isRaw(data: Buffer, network?: NetType): boolean {
    if (!Buffer.isBuffer(data)) return false;

    if (data.length < 4) return false;

    const version = data.readUInt32BE(0);

    try {
      Network.fromPublic(version, network);
      return true;
    } catch (e) {
      return false;
    }
  }

  fromBase58(xkey: Base58String, network?: NetType): HDPublicKey {
    return this.fromRaw(bs58.decode(xkey), network);
  }

  fromReader(br: BufferReader, network?: NetType): HDPublicKey {
    const version = br.readU32BE();

    Network.fromPublic(version, network);

    this.depth = br.readU8();
    this.parentFingerPrint = br.readU32BE();
    this.childIndex = br.readU32BE();
    this.chainCode = br.readBytes(48);
    this.publicKey = br.readBytes(PUBKEY_SIZE);

    br.verifyChecksum(hash256);

    return this;
  }

  fromRaw(data: Buffer, network?: NetType): HDPublicKey {
    return this.fromReader(read(data), network);
  }

  toBase58(network?: NetType): Base58String {
    return bs58.encode(this.toRaw(network));
  }

  toWriter(bw: StaticWriter, network?: NetType): StaticWriter {
    const net = new Network(network);

    bw.writeU32BE(net.network.keyPrefix.xpubkey);
    bw.writeU8(this.depth);
    bw.writeU32BE(this.parentFingerPrint);
    bw.writeU32BE(this.childIndex);
    bw.writeBytes(this.chainCode);
    bw.writeBytes(this.publicKey);
    bw.writeChecksum(hash256);

    return bw;
  }

  getSize(): number {
    return 82;
  }

  toRaw(network?: NetType): Buffer {
    return this.toWriter(write(65 + PUBKEY_SIZE), network).render();
  }

  static fromBase58(xkey: Base58String, network?: NetType): HDPublicKey {
    return new this().fromBase58(xkey, network);
  }

  static fromReader(br: BufferReader, network?: NetType): HDPublicKey {
    return new this().fromReader(br, network);
  }

  static fromRaw(data: Buffer, network?: NetType): HDPublicKey {
    return new this().fromRaw(data, network);
  }
}

export default HDPublicKey;
