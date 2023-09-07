"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRate =
  exports.getRoundFee =
  exports.getMinFee =
  exports.BLOCK_PRIORITY_THRESHOLD =
  exports.BLOCK_PRIORITY_WEIGHT =
  exports.PRIVKEY_SIZE =
  exports.PUBKEY_SIZE =
  exports.SIGNATURE_SIZE =
  exports.MIN_BLOCK_WEIGHT =
  exports.MEMPOOL_MAX_ORPHANS =
  exports.MEMPOOL_EXPIRY_TIME =
  exports.MEMPOOL_MAX_SIZE =
  exports.MEMPOOL_MAX_ANCESTORS =
  exports.MAX_P2WSH_SIZE =
  exports.MAX_P2WSH_PUSH =
  exports.MAX_P2WSH_STACK =
  exports.MAX_OP_RETURN =
  exports.MAX_OP_RETURN_BYTES =
  exports.MAX_P2SH_SIGOPS =
  exports.FREE_THRESHOLD =
  exports.BARE_MULTISIG =
  exports.MIN_RELAY =
  exports.BYTES_PER_SIGOP =
  exports.MAX_TX_SIGOPS_COST =
  exports.MAX_TX_SIGOPS =
  exports.MAX_TX_WEIGHT =
  exports.MAX_BLOCK_WEIGHT =
  exports.MAX_TX_SIZE =
  exports.MAX_TX_VERSION =
    void 0;
const consensus_1 = require("./consensus");
exports.MAX_TX_VERSION = 2;
exports.MAX_TX_SIZE = consensus_1.MAX_BLOCK_SIZE / 10;
exports.MAX_BLOCK_WEIGHT = 6000000 * consensus_1.WITNESS_SCALE_FACTOR;
exports.MAX_TX_WEIGHT = exports.MAX_BLOCK_WEIGHT / 10;
exports.MAX_TX_SIGOPS = consensus_1.MAX_BLOCK_SIGOPS / 5;
exports.MAX_TX_SIGOPS_COST = consensus_1.MAX_BLOCK_SIGOPS_COST / 5;
exports.BYTES_PER_SIGOP = 20;
exports.MIN_RELAY = 1000;
exports.BARE_MULTISIG = true;
exports.FREE_THRESHOLD = (consensus_1.COIN * 144) / 250;
exports.MAX_P2SH_SIGOPS = 15;
exports.MAX_OP_RETURN_BYTES = 83;
exports.MAX_OP_RETURN = 80;
exports.MAX_P2WSH_STACK = 100;
exports.MAX_P2WSH_PUSH = 80;
exports.MAX_P2WSH_SIZE = 3600;
exports.MEMPOOL_MAX_ANCESTORS = 25;
exports.MEMPOOL_MAX_SIZE = 100 * 1000000;
exports.MEMPOOL_EXPIRY_TIME = 72 * 60 * 60;
exports.MEMPOOL_MAX_ORPHANS = 100;
exports.MIN_BLOCK_WEIGHT = 0;
exports.SIGNATURE_SIZE = 690;
exports.PUBKEY_SIZE = 898;
exports.PRIVKEY_SIZE = 1281;
exports.BLOCK_PRIORITY_WEIGHT = 0;
exports.BLOCK_PRIORITY_THRESHOLD = exports.FREE_THRESHOLD;
function getMinFee(size, rate) {
  if (rate === undefined) rate = exports.MIN_RELAY;
  if (size === 0 || size === undefined) return 0;
  let fee = Math.floor((rate * size) / 1000);
  if (fee === 0 && rate > 0) fee = rate;
  return fee;
}
exports.getMinFee = getMinFee;
function getRoundFee(size, rate) {
  if (rate === undefined) rate = exports.MIN_RELAY;
  if (size === 0 || size === undefined) return 0;
  let fee = rate * Math.ceil(size / 1000);
  if (fee === 0 && rate > 0) fee = rate;
  return fee;
}
exports.getRoundFee = getRoundFee;
function getRate(size, fee) {
  if (size === 0) return 0;
  return Math.floor((fee * 1000) / size);
}
exports.getRate = getRate;
