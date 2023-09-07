"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sha512_1 = require("@noble/hashes/sha512");
const pbkdf2_1 = require("@noble/hashes/pbkdf2");
const utils_1 = require("@noble/hashes/utils");
const consensus_1 = require("../protocol/consensus");
const network_1 = __importDefault(require("../protocol/network"));
const policy_1 = require("../protocol/policy");
const common_1 = require("./common");
const public_1 = __importDefault(require("./public"));
const mnemonic_1 = __importDefault(require("./mnemonic"));
const bs58 = __importStar(require("bs58"));
const bufio_1 = require("@jil/bufio");
const rust_falcon_1 = require("rust-falcon");
const buffer_1 = require("buffer");
const SEED_SALT = buffer_1.Buffer.from("Tidecoin seed", "ascii");
class HDPrivateKey {
  constructor(options) {
    this.depth = 0;
    this.parentFingerPrint = 0;
    this.childIndex = 0;
    this.chainCode = consensus_1.ZERO_FALCON_HASH;
    this.privateKey = common_1.ZERO_PRIVKEY;
    this.publicKey = common_1.ZERO_KEY;
    this.fingerPrint = -1;
    this._hdPublicKey = null;
    if (options) this.fromOptions(options);
  }
  fromOptions(options) {
    if (options.depth) this.depth = options.depth;
    if (options.parentFingerPrint)
      this.parentFingerPrint = options.parentFingerPrint;
    if (options.childIndex) this.childIndex = options.childIndex;
    if (options.chainCode) this.chainCode = options.chainCode;
    if (options.privateKey) this.privateKey = options.privateKey;
    this.publicKey = buffer_1.Buffer.from(
      (0, rust_falcon_1.keypairFromPrivate)(options.privateKey).public
    ); //secp256k1.publicKeyCreate(options.privateKey, true);
    return this;
  }
  static fromOptions(options) {
    return new this().fromOptions(options);
  }
  toPublic() {
    let key = this._hdPublicKey;
    if (!key) {
      key = new public_1.default();
      key.depth = this.depth;
      key.parentFingerPrint = this.parentFingerPrint;
      key.childIndex = this.childIndex;
      key.chainCode = this.chainCode;
      key.publicKey = this.publicKey;
      this._hdPublicKey = key;
    }
    return key;
  }
  xprivkey(network) {
    return this.toBase58(network);
  }
  xpubkey(network) {
    return this.toPublic().xpubkey(network);
  }
  destroy(pub) {
    this.depth = 0;
    this.childIndex = 0;
    this.parentFingerPrint = 0;
    this.chainCode = consensus_1.ZERO_FALCON_HASH;
    this.privateKey = common_1.ZERO_PRIVKEY;
    this.publicKey = common_1.ZERO_KEY;
    this.fingerPrint = -1;
    if (this._hdPublicKey) {
      if (pub) this._hdPublicKey.destroy();
      this._hdPublicKey = null;
    }
  }
  derive(index) {
    if (index >>> 0 !== index) throw new Error("Index out of range.");
    if (this.depth >= 0xff) throw new Error("Depth too high.");
    const id = this.getID(index);
    const cacheValue = common_1.cache.get(id);
    if (cacheValue) return cacheValue;
    const bw = (0, bufio_1.pool)(policy_1.PUBKEY_SIZE + 4);
    bw.writeBytes(this.publicKey);
    bw.writeU32BE(index);
    const data = bw.render();
    const hash = buffer_1.Buffer.from(
      (0, pbkdf2_1.pbkdf2)(sha512_1.sha512, data, SEED_SALT, {
        dkLen: 96,
        c: 50000,
      })
    );
    const left = hash.subarray(0, 48);
    const right = hash.subarray(48, 96);
    let keys;
    try {
      keys = (0, rust_falcon_1.falconKeypair)(left);
    } catch (e) {
      return this.derive(index + 1);
    }
    if (this.fingerPrint === -1) {
      const fp = buffer_1.Buffer.from((0, common_1.hash160)(this.publicKey));
      this.fingerPrint = fp.readUInt32BE(0);
    }
    const child = new HDPrivateKey();
    child.depth = this.depth + 1;
    child.parentFingerPrint = this.fingerPrint;
    child.childIndex = index;
    child.chainCode = right;
    child.privateKey = buffer_1.Buffer.from(keys.secret);
    child.publicKey = buffer_1.Buffer.concat([
      buffer_1.Buffer.from([0x07]),
      keys.public,
    ]);
    common_1.cache.set(id, child);
    return child;
  }
  getID(index) {
    return "v" + this.publicKey.toString("hex") + index;
  }
  deriveAccount(purpose, type, account) {
    (0, common_1.assert)(this.isMaster(), "Cannot derive account index.");
    return this.derive(purpose).derive(type).derive(account);
  }
  isMaster() {
    return (0, common_1.isMaster)(this);
  }
  isAccount(account) {
    return (0, common_1.isAccount)(this, account);
  }
  static isBase58(data, network) {
    if (typeof data !== "string") return false;
    if (data.length < 4) return false;
    const prefix = data.substring(0, 4);
    try {
      network_1.default.fromPrivate58(prefix, network);
      return true;
    } catch (e) {
      return false;
    }
  }
  static isRaw(data, network) {
    if (!buffer_1.Buffer.isBuffer(data)) return false;
    if (data.length < 4) return false;
    const version = data.readUInt32BE(0);
    try {
      network_1.default.fromPrivate(version, network);
      return true;
    } catch (e) {
      return false;
    }
  }
  static isValidPath(path) {
    try {
      (0, common_1.parsePath)(path);
      return true;
    } catch (e) {
      return false;
    }
  }
  derivePath(path) {
    const indexes = (0, common_1.parsePath)(path);
    let key = this;
    for (const index of indexes) key = key.derive(index);
    return key;
  }
  equals(obj) {
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
  compare(key) {
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
  fromSeed(seed) {
    if (
      seed.length * 8 < common_1.MIN_ENTROPY ||
      seed.length * 8 > common_1.MAX_ENTROPY
    ) {
      throw new Error("Entropy not in the range.");
    }
    const hash = buffer_1.Buffer.from(
      (0, pbkdf2_1.pbkdf2)(sha512_1.sha512, seed, SEED_SALT, {
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
    this.chainCode = buffer_1.Buffer.from(right);
    let keys;
    keys = (0, rust_falcon_1.falconKeypair)(left);
    this.privateKey = buffer_1.Buffer.from(keys.secret);
    this.publicKey = buffer_1.Buffer.concat([
      buffer_1.Buffer.from([0x07]),
      keys.public,
    ]);
    return this;
  }
  static fromSeed(seed) {
    return new this().fromSeed(seed);
  }
  fromMnemonic(mnemonic, passphrase) {
    return this.fromSeed(mnemonic.toSeed(passphrase));
  }
  static fromMnemonic(mnemonic, passphrase) {
    return new this().fromMnemonic(mnemonic, passphrase);
  }
  fromPhrase(phrase) {
    const mnemonic = mnemonic_1.default.fromPhrase(phrase);
    this.fromMnemonic(mnemonic);
    return this;
  }
  static fromPhrase(phrase) {
    return new this().fromPhrase(phrase);
  }
  fromKey(key, entropy) {
    (0, common_1.assert)(key.length === policy_1.PRIVKEY_SIZE);
    (0, common_1.assert)(entropy.length === 48);
    this.depth = 0;
    this.parentFingerPrint = 0;
    this.childIndex = 0;
    this.chainCode = entropy;
    this.privateKey = key;
    this.publicKey = buffer_1.Buffer.concat([
      buffer_1.Buffer.from([0x07]),
      (0, rust_falcon_1.keypairFromPrivate)(key).public,
    ]);
    return this;
  }
  static fromKey(key, entropy) {
    return new this().fromKey(key, entropy);
  }
  static generate() {
    const keys = (0, rust_falcon_1.falconKeypair)((0, utils_1.randomBytes)(48));
    const entropy = (0, utils_1.randomBytes)(48);
    return HDPrivateKey.fromKey(
      buffer_1.Buffer.from(keys.secret),
      buffer_1.Buffer.from(entropy)
    );
  }
  fromBase58(xkey, network) {
    return this.fromRaw(bs58.decode(xkey), network);
  }
  fromReader(br, network) {
    const version = br.readU32BE();
    network_1.default.fromPrivate(version, network);
    this.depth = br.readU8();
    this.parentFingerPrint = br.readU32BE();
    this.childIndex = br.readU32BE();
    this.chainCode = br.readBytes(48);
    (0, common_1.assert)(br.readU8() === 0);
    this.privateKey = br.readBytes(policy_1.PRIVKEY_SIZE);
    this.publicKey = buffer_1.Buffer.concat([
      buffer_1.Buffer.from([0x07]),
      (0, rust_falcon_1.keypairFromPrivate)(this.privateKey).public,
    ]);
    br.verifyChecksum(common_1.hash256);
    return this;
  }
  fromRaw(data, network) {
    return this.fromReader((0, bufio_1.read)(data), network);
  }
  toBase58(network) {
    return bs58.encode(this.toRaw(network));
  }
  getSize() {
    return 82;
  }
  toWriter(bw, network) {
    const net = new network_1.default(network);
    bw.writeU32BE(net.network?.keyPrefix.xprivkey);
    bw.writeU8(this.depth);
    bw.writeU32BE(this.parentFingerPrint);
    bw.writeU32BE(this.childIndex);
    bw.writeBytes(this.chainCode);
    bw.writeU8(0);
    bw.writeBytes(this.privateKey);
    bw.writeChecksum(common_1.hash256);
    return bw;
  }
  toRaw(network) {
    return this.toWriter(
      (0, bufio_1.write)(66 + policy_1.PRIVKEY_SIZE),
      network
    ).render();
  }
  static fromBase58(xkey, network) {
    return new this().fromBase58(xkey, network);
  }
  static fromReader(br, network) {
    return new this().fromReader(br, network);
  }
  static fromRaw(data, network) {
    return new this().fromRaw(data, network);
  }
  toJSON(network) {
    return {
      xprivkey: this.xprivkey(network),
    };
  }
  fromJSON(json, network) {
    this.fromBase58(json.xprivkey, network);
    return this;
  }
  static fromJSON(json, network) {
    return new this().fromJSON(json, network);
  }
}
exports.default = HDPrivateKey;
