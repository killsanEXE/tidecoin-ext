"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRaw =
  exports.isBase58 =
  exports.from =
  exports.fromRaw =
  exports.fromJSON =
  exports.fromMnemonic =
  exports.fromSeed =
  exports.generate =
  exports.fromBase58 =
    void 0;
const private_1 = __importDefault(require("./private"));
const public_1 = __importDefault(require("./public"));
function fromBase58(xkey, network) {
  if (private_1.default.isBase58(xkey))
    return private_1.default.fromBase58(xkey, network);
  return public_1.default.fromBase58(xkey, network);
}
exports.fromBase58 = fromBase58;
function generate() {
  return private_1.default.generate();
}
exports.generate = generate;
function fromSeed(options) {
  return private_1.default.fromSeed(options);
}
exports.fromSeed = fromSeed;
function fromMnemonic(options) {
  return private_1.default.fromMnemonic(options);
}
exports.fromMnemonic = fromMnemonic;
function fromJSON(json, network) {
  if (json.xprivkey) return private_1.default.fromJSON(json, network);
  return public_1.default.fromJSON({ xpubkey: json.xpubkey }, network);
}
exports.fromJSON = fromJSON;
function fromRaw(data, network) {
  if (private_1.default.isRaw(data, network))
    return private_1.default.fromRaw(data, network);
  return public_1.default.fromRaw(data, network);
}
exports.fromRaw = fromRaw;
function from(options, network) {
  if (
    options instanceof public_1.default ||
    options instanceof private_1.default
  )
    return options;
  if (isBase58(options, network)) return fromBase58(options, network);
  if (isRaw(options, network)) return fromRaw(options, network);
  if (options && typeof options === "object") return fromMnemonic(options);
  throw new Error("Cannot create HD key from bad options.");
}
exports.from = from;
function isBase58(data, network) {
  return (
    private_1.default.isBase58(data, network) ||
    public_1.default.isBase58(data, network)
  );
}
exports.isBase58 = isBase58;
function isRaw(data, network) {
  return (
    private_1.default.isRaw(data, network) ||
    public_1.default.isRaw(data, network)
  );
}
exports.isRaw = isRaw;
