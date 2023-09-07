"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const timedelta_1 = __importDefault(require("./timedelta"));
const consensus_1 = require("./consensus");
const binary_1 = require("../utils/binary");
const networks_1 = require("./networks");
class Network {
  constructor(network = networks_1.MAINNET) {
    this.network = network;
    this.checkpoints = [];
    this.unknownBits = ~consensus_1.VERSION_TOP_MASK;
    this.time = new timedelta_1.default();
    this.init();
  }
  init() {
    let bits = 0;
    for (const deployment of this.network.deploys) bits |= 1 << deployment.bit;
    bits |= consensus_1.VERSION_TOP_MASK;
    this.unknownBits = ~bits >>> 0;
    for (const key of Object.keys(this.network.checkpointMap)) {
      const hash = this.network.checkpointMap[key];
      const height = Number(key);
      this.checkpoints.push({ hash, height });
    }
    this.checkpoints.sort(cmpNode);
  }
  byBit(bit) {
    const index = (0, binary_1.search)(this.network.deploys, bit, cmpBit);
    if (index === -1) return null;
    return this.network.deploys[index];
  }
  now() {
    return this.time.now();
  }
  ms() {
    return this.time.ms();
  }
  static by(value, compare, network, name) {
    if (network) {
      if (compare(network, value)) return new Network(network);
      throw new Error(`Network mismatch for ${name}.`);
    }
    throw new Error(`Network not found for ${name}.`);
  }
  static fromMagic(value, network) {
    return Network.by(value, cmpMagic, network, "magic number");
  }
  static fromWIF(prefix, network) {
    return Network.by(prefix, cmpWIF, network, "WIF");
  }
  static fromPublic(prefix, network) {
    return Network.by(prefix, cmpPub, network, "xpubkey");
  }
  static fromPrivate(prefix, network) {
    return Network.by(prefix, cmpPriv, network, "xprivkey");
  }
  static fromPublic58(prefix, network) {
    return Network.by(prefix, cmpPub58, network, "xpubkey");
  }
  static fromPrivate58(prefix, network) {
    return Network.by(prefix, cmpPriv58, network, "xprivkey");
  }
  static fromBase58(prefix, network) {
    return Network.by(prefix, cmpBase58, network, "base58 address");
  }
  static fromBech32(hrp, network) {
    return Network.by(hrp, cmpBech32, network, "bech32 address");
  }
  static fromBech32m(hrp, network) {
    return Network.by(hrp, cmpBech32, network, "bech32m address");
  }
  toString() {
    return this.network.type;
  }
  inspect() {
    return `<Network: ${this.network.type}>`;
  }
  static isNetwork(obj) {
    return obj instanceof Network;
  }
}
function cmpBit(a, b) {
  return a.bit - b;
}
function cmpNode(a, b) {
  return a.height - b.height;
}
function cmpMagic(network, magic) {
  return network.network.magic === magic;
}
function cmpWIF(network, prefix) {
  return network.network.keyPrefix.privkey === prefix;
}
function cmpPub(network, prefix) {
  return network.network.keyPrefix.xpubkey === prefix;
}
function cmpPriv(network, prefix) {
  return network.network.keyPrefix.xprivkey === prefix;
}
function cmpPub58(network, prefix) {
  return network.network.keyPrefix.xpubkey58 === prefix;
}
function cmpPriv58(network, prefix) {
  return network.network.keyPrefix.xprivkey58 === prefix;
}
function cmpBase58(network, prefix) {
  const prefixes = network.network.addressPrefix;
  switch (prefix) {
    case prefixes.pubkeyhash:
    case prefixes.scripthash:
      return true;
  }
  return false;
}
function cmpBech32(network, hrp) {
  return network.network.addressPrefix.bech32 === hrp;
}
exports.default = Network;
