import { sha512 } from "@noble/hashes/sha512";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { randomBytes } from "@noble/hashes/utils";
import { ZERO_FALCON_HASH } from "../protocol/consensus";
import Network from "../protocol/network";
import { PRIVKEY_SIZE, PUBKEY_SIZE } from "../protocol/policy";
import { NetType } from "../protocol/types";
import {
  MAX_ENTROPY,
  MIN_ENTROPY,
  ZERO_KEY,
  ZERO_PRIVKEY,
  assert,
  cache,
  hash160,
  hash256,
  isAccount,
  isMaster,
  parsePath,
} from "./common";
import HDPublicKey from "./public";
import { PrivateKeyOptions, Base58String } from "./types";
import Mnemonic from "./mnemonic";
import * as bs58 from "bs58";
import { BufferReader, StaticWriter, pool, read, write } from "@jil/bufio";
import { falconKeypair, keypairFromPrivate } from "rust-falcon";
import { Buffer } from "buffer";

const SEED_SALT = Buffer.from("Tidecoin seed", "ascii");

class HDPrivateKey {
  depth: number = 0;
  parentFingerPrint: number = 0;
  childIndex: number = 0;
  chainCode: Buffer = ZERO_FALCON_HASH;
  privateKey: Buffer = ZERO_PRIVKEY;
  publicKey = ZERO_KEY;
  fingerPrint = -1;
  _hdPublicKey?: any = null;

  constructor(options?: PrivateKeyOptions) {
    if (options) this.fromOptions(options);
  }

  fromOptions(options: PrivateKeyOptions) {
    if (options.depth) this.depth = options.depth;
    if (options.parentFingerPrint)
      this.parentFingerPrint = options.parentFingerPrint;
    if (options.childIndex) this.childIndex = options.childIndex;
    if (options.chainCode) this.chainCode = options.chainCode;
    if (options.privateKey) this.privateKey = options.privateKey;
    this.publicKey = Buffer.from(keypairFromPrivate(options.privateKey).public); //secp256k1.publicKeyCreate(options.privateKey, true);

    return this;
  }

  static fromOptions(options: PrivateKeyOptions) {
    return new this().fromOptions(options);
  }

  toPublic(): HDPublicKey {
    let key = this._hdPublicKey;

    if (!key) {
      key = new HDPublicKey();
      key.depth = this.depth;
      key.parentFingerPrint = this.parentFingerPrint;
      key.childIndex = this.childIndex;
      key.chainCode = this.chainCode;
      key.publicKey = this.publicKey;
      this._hdPublicKey = key;
    }

    return key;
  }

  xprivkey(network?: NetType): Base58String {
    return this.toBase58(network);
  }

  xpubkey(network?: NetType): Base58String {
    return this.toPublic().xpubkey(network);
  }

  destroy(pub: boolean) {
    this.depth = 0;
    this.childIndex = 0;
    this.parentFingerPrint = 0;

    this.chainCode = ZERO_FALCON_HASH;
    this.privateKey = ZERO_PRIVKEY;
    this.publicKey = ZERO_KEY;

    this.fingerPrint = -1;

    if (this._hdPublicKey) {
      if (pub) this._hdPublicKey.destroy();
      this._hdPublicKey = null;
    }
  }

  derive(index: number): HDPrivateKey {
    if (index >>> 0 !== index) throw new Error("Index out of range.");

    if (this.depth >= 0xff) throw new Error("Depth too high.");

    const id = this.getID(index);
    const cacheValue = cache.get(id) as HDPrivateKey;

    if (cacheValue) return cacheValue;

    const bw = pool(PUBKEY_SIZE + 4);

    bw.writeBytes(this.publicKey);
    bw.writeU32BE(index);

    const data = bw.render();

    const hash = Buffer.from(
      pbkdf2(sha512, data, SEED_SALT, {
        dkLen: 96,
        c: 50000,
      })
    );
    const left = hash.subarray(0, 48);
    const right = hash.subarray(48, 96);

    let keys;
    try {
      keys = falconKeypair(left);
    } catch (e) {
      return this.derive(index + 1);
    }

    if (this.fingerPrint === -1) {
      const fp = Buffer.from(hash160(this.publicKey));
      this.fingerPrint = fp.readUInt32BE(0);
    }

    const child = new HDPrivateKey();
    child.depth = this.depth + 1;
    child.parentFingerPrint = this.fingerPrint;
    child.childIndex = index;
    child.chainCode = right;
    child.privateKey = Buffer.from(keys.secret);
    child.publicKey = Buffer.concat([Buffer.from([0x07]), keys.public]);

    cache.set(id, child);

    return child;
  }

  getID(index: number): string {
    return "v" + this.publicKey.toString("hex") + index;
  }

  deriveAccount(purpose: number, type: number, account: number): HDPrivateKey {
    assert(this.isMaster(), "Cannot derive account index.");
    return this.derive(purpose).derive(type).derive(account);
  }

  isMaster(): boolean {
    return isMaster(this);
  }

  isAccount(account?: number): boolean {
    return isAccount(this, account);
  }

  static isBase58(data: string, network?: NetType): boolean {
    if (typeof data !== "string") return false;

    if (data.length < 4) return false;

    const prefix = data.substring(0, 4);

    try {
      Network.fromPrivate58(prefix, network!);
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
      Network.fromPrivate(version, network);
      return true;
    } catch (e) {
      return false;
    }
  }

  static isValidPath(path: string): boolean {
    try {
      parsePath(path);
      return true;
    } catch (e) {
      return false;
    }
  }

  derivePath(path: string): HDPrivateKey {
    const indexes = parsePath(path);

    let key: any = this;

    for (const index of indexes) key = key.derive(index);

    return key;
  }

  equals(obj: PrivateKeyOptions): boolean {
    if (!obj.chainCode || !obj.privateKey)
      throw new Error("Missed chainCode or private key");

    return (
      this.depth === obj.depth &&
      this.parentFingerPrint === obj.parentFingerPrint &&
      this.childIndex === obj.childIndex &&
      this.chainCode.equals(obj.chainCode) &&
      this.privateKey.equals(obj.privateKey)
    );
  }

  compare(key: PrivateKeyOptions): number | undefined {
    if (key.depth === undefined) return 0;

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

    if (!key.privateKey) return;

    cmp = this.privateKey.compare(key.privateKey);

    if (cmp !== 0) return cmp;

    return 0;
  }

  fromSeed(seed: Buffer) {
    if (seed.length * 8 < MIN_ENTROPY || seed.length * 8 > MAX_ENTROPY) {
      throw new Error("Entropy not in the range.");
    }

    const hash = Buffer.from(
      pbkdf2(sha512, seed, SEED_SALT, {
        dkLen: 96,
        c: 50000,
      })
    );
    const left = hash.subarray(0, 48);
    const right = hash.subarray(48, 96);

    // Only a 1 in 2^127 chance of happening.

    this.depth = 0;
    this.parentFingerPrint = 0;
    this.childIndex = 0;
    this.chainCode = Buffer.from(right);

    let keys;

    keys = falconKeypair(left);

    this.privateKey = Buffer.from(keys.secret);
    this.publicKey = Buffer.concat([Buffer.from([0x07]), keys.public]);

    return this;
  }

  static fromSeed(seed: Buffer): HDPrivateKey {
    return new this().fromSeed(seed);
  }

  fromMnemonic(mnemonic: Mnemonic, passphrase?: string): HDPrivateKey {
    return this.fromSeed(mnemonic.toSeed(passphrase));
  }

  static fromMnemonic(mnemonic: Mnemonic, passphrase?: string): HDPrivateKey {
    return new this().fromMnemonic(mnemonic, passphrase);
  }

  fromPhrase(phrase: string): HDPrivateKey {
    const mnemonic = Mnemonic.fromPhrase(phrase);
    this.fromMnemonic(mnemonic);
    return this;
  }

  static fromPhrase(phrase: string): HDPrivateKey {
    return new this().fromPhrase(phrase);
  }

  fromKey(key: Buffer, entropy: Buffer): HDPrivateKey {
    assert(key.length === PRIVKEY_SIZE);
    assert(entropy.length === 48);
    this.depth = 0;
    this.parentFingerPrint = 0;
    this.childIndex = 0;
    this.chainCode = entropy;
    this.privateKey = key;
    this.publicKey = Buffer.concat([
      Buffer.from([0x07]),
      keypairFromPrivate(key).public,
    ]);
    return this;
  }

  static fromKey(key: Buffer, entropy: Buffer): HDPrivateKey {
    return new this().fromKey(key, entropy);
  }

  static generate(): HDPrivateKey {
    const keys = falconKeypair(randomBytes(48));
    const entropy = randomBytes(48);
    return HDPrivateKey.fromKey(Buffer.from(keys.secret), Buffer.from(entropy));
  }

  fromBase58(xkey: Base58String, network?: NetType): HDPrivateKey {
    return this.fromRaw(bs58.decode(xkey), network);
  }

  fromReader(br: BufferReader, network?: NetType): HDPrivateKey {
    const version = br.readU32BE();

    Network.fromPrivate(version, network);

    this.depth = br.readU8();
    this.parentFingerPrint = br.readU32BE();
    this.childIndex = br.readU32BE();
    this.chainCode = br.readBytes(48);
    assert(br.readU8() === 0);
    this.privateKey = br.readBytes(PRIVKEY_SIZE);
    this.publicKey = Buffer.concat([
      Buffer.from([0x07]),
      keypairFromPrivate(this.privateKey).public,
    ]);

    br.verifyChecksum(hash256);

    return this;
  }

  fromRaw(data: Buffer, network?: NetType) {
    return this.fromReader(read(data), network);
  }

  toBase58(network?: NetType): Base58String {
    return bs58.encode(this.toRaw(network));
  }

  getSize(): number {
    return 82;
  }

  toWriter(bw: StaticWriter, network?: NetType) {
    const net = new Network(network);

    bw.writeU32BE(net.network?.keyPrefix.xprivkey);
    bw.writeU8(this.depth);
    bw.writeU32BE(this.parentFingerPrint);
    bw.writeU32BE(this.childIndex);
    bw.writeBytes(this.chainCode);
    bw.writeU8(0);
    bw.writeBytes(this.privateKey);
    bw.writeChecksum(hash256);

    return bw;
  }

  toRaw(network?: NetType): Buffer {
    return this.toWriter(write(66 + PRIVKEY_SIZE), network).render();
  }

  static fromBase58(xkey: Base58String, network?: NetType): HDPrivateKey {
    return new this().fromBase58(xkey, network);
  }

  static fromReader(br: BufferReader, network?: NetType): HDPrivateKey {
    return new this().fromReader(br, network);
  }

  static fromRaw(data: Buffer, network?: NetType): HDPrivateKey {
    return new this().fromRaw(data, network);
  }

  toJSON(network?: NetType) {
    return {
      xprivkey: this.xprivkey(network),
    };
  }

  fromJSON(json: { xprivkey: string }, network?: NetType) {
    this.fromBase58(json.xprivkey, network);

    return this;
  }

  static fromJSON(json: any, network?: NetType): HDPrivateKey {
    return new this().fromJSON(json, network);
  }
}

export default HDPrivateKey;
