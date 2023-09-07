"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAccount =
  exports.isMaster =
  exports.parsePath =
  exports.cache =
  exports.assert =
  exports.hash256 =
  exports.hash160 =
  exports.ZERO_PRIVKEY =
  exports.ZERO_KEY =
  exports.MAX_ENTROPY =
  exports.MIN_ENTROPY =
    void 0;
const ripemd160_1 = require("@noble/hashes/ripemd160");
const policy_1 = require("../protocol/policy");
const sha256_1 = require("@noble/hashes/sha256");
const tiny_lru_1 = require("tiny-lru");
const buffer_1 = require("buffer");
exports.MIN_ENTROPY = 384;
exports.MAX_ENTROPY = 512;
exports.ZERO_KEY = buffer_1.Buffer.alloc(policy_1.PUBKEY_SIZE, 0x00);
exports.ZERO_PRIVKEY = buffer_1.Buffer.alloc(policy_1.PRIVKEY_SIZE, 0x00);
const hash160 = (value) =>
  buffer_1.Buffer.from((0, ripemd160_1.ripemd160)((0, sha256_1.sha256)(value)));
exports.hash160 = hash160;
const hash256 = (value) =>
  buffer_1.Buffer.from((0, sha256_1.sha256)((0, sha256_1.sha256)(value)));
exports.hash256 = hash256;
const assert = (exp, message) => {
  if (exp) return true;
  throw new Error(message);
};
exports.assert = assert;
exports.cache = (0, tiny_lru_1.lru)(500);
function parsePath(path) {
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
exports.parsePath = parsePath;
const isMaster = function isMaster(key) {
  return key.depth === 0 && key.childIndex === 0 && key.parentFingerPrint === 0;
};
exports.isMaster = isMaster;
const isAccount = function isAccount(key, account) {
  if (account != null) {
    const index = account >>> 0;
    if (key.childIndex !== index) return false;
  }
  return key.depth === 3 && key.childIndex !== 0;
};
exports.isAccount = isAccount;
