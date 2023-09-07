"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBit =
  exports.getReward =
  exports.verifyPOW =
  exports.toCompact =
  exports.fromCompact =
  exports.ZERO_FALCON_HASH =
  exports.ZERO_HASH =
  exports.BIP16_TIME =
  exports.MAX_MULTISIG_PUBKEYS =
  exports.MAX_SCRIPT_OPS =
  exports.MAX_SCRIPT_PUSH =
  exports.MAX_SCRIPT_STACK =
  exports.MAX_SCRIPT_SIZE =
  exports.SEQUENCE_MASK =
  exports.SEQUENCE_GRANULARITY =
  exports.SEQUENCE_TYPE_FLAG =
  exports.SEQUENCE_DISABLE_FLAG =
  exports.LOCKTIME_THRESHOLD =
  exports.WITNESS_SCALE_FACTOR =
  exports.COINBASE_MATURITY =
  exports.VERSION_TOP_MASK =
  exports.VERSION_TOP_BITS =
  exports.MEDIAN_TIMESPAN =
  exports.MAX_BLOCK_SIGOPS_COST =
  exports.MAX_BLOCK_SIGOPS =
  exports.MAX_BLOCK_WEIGHT =
  exports.MAX_RAW_BLOCK_SIZE =
  exports.MAX_BLOCK_SIZE =
  exports.HALF_REWARD =
  exports.BASE_REWARD =
  exports.MAX_MONEY =
  exports.COIN =
    void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const common_1 = require("../hd/common");
const buffer_1 = require("buffer");
exports.COIN = 100000000;
exports.MAX_MONEY = 21000000 * exports.COIN;
exports.BASE_REWARD = 40 * exports.COIN;
exports.HALF_REWARD = Math.floor(exports.BASE_REWARD / 2);
exports.MAX_BLOCK_SIZE = 6000000;
exports.MAX_RAW_BLOCK_SIZE = 8000000;
exports.MAX_BLOCK_WEIGHT = 8000000;
exports.MAX_BLOCK_SIGOPS = 1000000 / 50;
exports.MAX_BLOCK_SIGOPS_COST = 80000;
exports.MEDIAN_TIMESPAN = 11;
exports.VERSION_TOP_BITS = 0x20000000;
exports.VERSION_TOP_MASK = 0xe0000000;
exports.COINBASE_MATURITY = 100;
exports.WITNESS_SCALE_FACTOR = 4;
exports.LOCKTIME_THRESHOLD = 500000000;
exports.SEQUENCE_DISABLE_FLAG = (1 << 31) >>> 0;
exports.SEQUENCE_TYPE_FLAG = 1 << 22;
exports.SEQUENCE_GRANULARITY = 9;
exports.SEQUENCE_MASK = 0x0000ffff;
exports.MAX_SCRIPT_SIZE = 100000;
exports.MAX_SCRIPT_STACK = 2000;
exports.MAX_SCRIPT_PUSH = 1897;
exports.MAX_SCRIPT_OPS = 201;
exports.MAX_MULTISIG_PUBKEYS = 20;
exports.BIP16_TIME = 1333238400;
exports.ZERO_HASH = buffer_1.Buffer.alloc(32, 0x00);
exports.ZERO_FALCON_HASH = buffer_1.Buffer.alloc(48, 0x00);
function fromCompact(compact) {
  if (compact === 0) return new bn_js_1.default(0);
  const exponent = compact >>> 24;
  const negative = (compact >>> 23) & 1;
  let mantissa = compact & 0x7fffff;
  let num;
  if (exponent <= 3) {
    mantissa >>>= 8 * (3 - exponent);
    num = new bn_js_1.default(mantissa);
  } else {
    num = new bn_js_1.default(mantissa);
    num.iushln(8 * (exponent - 3));
  }
  if (negative) num.ineg();
  return num;
}
exports.fromCompact = fromCompact;
function toCompact(num) {
  if (num.isZero()) return 0;
  let exponent = num.byteLength();
  let mantissa;
  if (exponent <= 3) {
    mantissa = num.toNumber();
    mantissa <<= 8 * (3 - exponent);
  } else {
    mantissa = num.ushrn(8 * (exponent - 3)).toNumber();
  }
  if (mantissa & 0x800000) {
    mantissa >>= 8;
    exponent++;
  }
  let compact = (exponent << 24) | mantissa;
  if (num.isNeg()) compact |= 0x800000;
  compact >>>= 0;
  return compact;
}
exports.toCompact = toCompact;
function verifyPOW(hash, bits) {
  const target = fromCompact(bits);
  if (target.isNeg() || target.isZero()) return false;
  const num = new bn_js_1.default(hash, "le");
  if (num.cmp(target) > 0) return false;
  return true;
}
exports.verifyPOW = verifyPOW;
function getReward(height, interval) {
  (0, common_1.assert)(height >= 0, "Bad height for reward.");
  const halvings = Math.floor(height / interval);
  if (halvings >= 33) return 0;
  if (halvings === 0) return exports.BASE_REWARD;
  return exports.HALF_REWARD >>> (halvings - 1);
}
exports.getReward = getReward;
function hasBit(version, bit) {
  const TOP_MASK = exports.VERSION_TOP_MASK;
  const TOP_BITS = exports.VERSION_TOP_BITS;
  const bits = (version & TOP_MASK) >>> 0;
  const mask = 1 << bit;
  return bits === TOP_BITS && (version & mask) !== 0;
}
exports.hasBit = hasBit;
