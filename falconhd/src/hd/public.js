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
const consensus_1 = require("../protocol/consensus");
const common_1 = require("./common");
const pbkdf2_1 = require("@noble/hashes/pbkdf2");
const sha512_1 = require("@noble/hashes/sha512");
const policy_1 = require("../protocol/policy");
const bs58 = __importStar(require("bs58"));
const network_1 = __importDefault(require("../protocol/network"));
const bufio_1 = require("@jil/bufio");
const rust_falcon_1 = require("rust-falcon");
const buffer_1 = require("buffer");
class HDPublicKey {
  constructor(options) {
    this.depth = 0;
    this.parentFingerPrint = 0;
    this.childIndex = 0;
    this.chainCode = consensus_1.ZERO_FALCON_HASH;
    this.publicKey = common_1.ZERO_KEY;
    this.fingerPrint = -1;
    if (options) this.fromOptions(options);
  }
  fromOptions(options) {
    if (options.depth) this.depth = options.depth;
    if (options.parentFingerPrint)
      this.parentFingerPrint = options.parentFingerPrint;
    if (options.childIndex) this.childIndex = options.childIndex;
    if (options.chainCode) this.chainCode = options.chainCode;
    if (options.publicKey) this.publicKey = options.publicKey;
    return this;
  }
  static fromOptions(options) {
    return new this().fromOptions(options);
  }
  toPublic() {
    return this;
  }
  xpubkey(network) {
    return this.toBase58(network);
  }
  /**
   * Destroy the key (zeroes chain code and pubkey).
   */
  destroy() {
    this.depth = 0;
    this.childIndex = 0;
    this.parentFingerPrint = 0;
    this.chainCode = consensus_1.ZERO_FALCON_HASH;
    this.publicKey = common_1.ZERO_KEY;
    this.fingerPrint = -1;
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
    //const hash = sha512.mac(data, this.chainCode);
    const hash = buffer_1.Buffer.from(
      (0, pbkdf2_1.pbkdf2)(sha512_1.sha512, data, this.chainCode, {
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
      keys = (0, rust_falcon_1.falconKeypair)(left);
    } catch (e) {
      return this.derive(index + 1);
    }
    if (this.fingerPrint === -1) {
      const fp = buffer_1.Buffer.from((0, common_1.hash160)(this.publicKey));
      this.fingerPrint = fp.readUInt32BE(0);
    }
    const child = new HDPublicKey();
    child.depth = this.depth + 1;
    child.parentFingerPrint = this.fingerPrint;
    child.childIndex = index;
    child.chainCode = right;
    child.publicKey = buffer_1.Buffer.concat([
      buffer_1.Buffer.from([0x07]),
      keys.public,
    ]);
    common_1.cache.set(id, child);
    return child;
  }
  getID(index) {
    return "b" + this.publicKey.toString("hex") + index;
  }
  deriveAccount(account) {
    (0, common_1.assert)(
      this.isAccount(account),
      "Cannot derive account index."
    );
    return this;
  }
  isMaster() {
    return (0, common_1.isMaster)(this);
  }
  isAccount(account) {
    return (0, common_1.isAccount)(this, account);
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
    return (
      this.depth === obj.depth &&
      this.parentFingerPrint === obj.parentFingerPrint &&
      this.childIndex === obj.childIndex &&
      this.chainCode.equals(obj.chainCode) &&
      this.publicKey.equals(obj.publicKey)
    );
  }
  compare(key) {
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
  toJSON(network) {
    return {
      xpubkey: this.xpubkey(network),
    };
  }
  fromJSON(json, network) {
    this.fromBase58(json.xpubkey, network);
    return this;
  }
  static fromJSON(json, network) {
    return new this().fromJSON(json, network);
  }
  static isBase58(data, network) {
    if (typeof data !== "string") return false;
    if (data.length < 4) return false;
    const prefix = data.substring(0, 4);
    try {
      network_1.default.fromPublic58(prefix, network);
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
      network_1.default.fromPublic(version, network);
      return true;
    } catch (e) {
      return false;
    }
  }
  fromBase58(xkey, network) {
    return this.fromRaw(bs58.decode(xkey), network);
  }
  fromReader(br, network) {
    const version = br.readU32BE();
    network_1.default.fromPublic(version, network);
    this.depth = br.readU8();
    this.parentFingerPrint = br.readU32BE();
    this.childIndex = br.readU32BE();
    this.chainCode = br.readBytes(48);
    this.publicKey = br.readBytes(policy_1.PUBKEY_SIZE);
    br.verifyChecksum(common_1.hash256);
    return this;
  }
  fromRaw(data, network) {
    return this.fromReader((0, bufio_1.read)(data), network);
  }
  toBase58(network) {
    return bs58.encode(this.toRaw(network));
  }
  toWriter(bw, network) {
    const net = new network_1.default(network);
    bw.writeU32BE(net.network.keyPrefix.xpubkey);
    bw.writeU8(this.depth);
    bw.writeU32BE(this.parentFingerPrint);
    bw.writeU32BE(this.childIndex);
    bw.writeBytes(this.chainCode);
    bw.writeBytes(this.publicKey);
    bw.writeChecksum(common_1.hash256);
    return bw;
  }
  getSize() {
    return 82;
  }
  toRaw(network) {
    return this.toWriter(
      (0, bufio_1.write)(65 + policy_1.PUBKEY_SIZE),
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
}
exports.default = HDPublicKey;
