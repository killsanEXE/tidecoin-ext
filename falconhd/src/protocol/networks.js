"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAINNET = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer");
function b(hash) {
  return buffer_1.Buffer.from(hash, "hex");
}
exports.MAINNET = {
  type: "main",
  seeds: ["tidecoin.ddnsgeek.com", "tidecoin.theworkpc.com"],
  magic: 0xa5cefaec,
  port: 8755,
  checkpointMap: {
    1500: b("67916841d2f30b924ae8957b419429efe9a6b487b4d7fc327996eac431ef88e5"),
    7200: b("55034a1ec597a5d041fb0fcdc08bafa0c1005bb9d8a46286d7e2205c815614ec"),
  },
  lastCheckpoint: 155,
  halvingInterval: 262800,
  genesis: {
    version: 1,
    hash: b("758001d37f6a48809eefae1562da1d391c3866ed773348329f98d80276cc0e48"),
    prevBlock: b(
      "0000000000000000000000000000000000000000000000000000000000000000"
    ),
    merkleRoot: b(
      "f84f615d33696e93be82ce3d74548329fa42610fbcbe03fdcc2d980b5c3ca050"
    ),
    time: 1609074580,
    bits: 537001983,
    nonce: 13027434,
    height: 0,
  },
  genesisBlock:
    "010000000000000000000000000000000000000000000000000000000000000000000000" +
    "f84f615d33696e93be82ce3d74548329fa42610fbcbe03fdcc2d980b5c3ca0509487e8" +
    "5fffff0120855ba8000101000000010000000000000000000000000000000000000000" +
    "000000000000000000000000ffffffff6a04ffff001d01044c61737065637472756d2e" +
    "696565652e6f72672030392f4465632f323032302050686f746f6e6963205175616e74" +
    "756d20436f6d707574657220446973706c617973202753757072656d61637927204f76" +
    "6572205375706572636f6d7075746572732effffffff0100f2052a01000000fd86034d" +
    "8203070903b9fdabf894363dea700a33acedb349b8d3d605ab6a8a997bf885581a5cb6" +
    "56758d18b3d17b144aeba442ccdd5538c4d88dd45d28ea8cf3b1e60f73af23a6ac866d" +
    "56f8c49eabf84ad3e7a90c4b198f7a661cae08869fb07ba0ca2a2dcbbba5619f43e214" +
    "c088da988eae9a39d6a5992c697cf56b46b6a81d6710b2c84d7134546b3eafc43da645" +
    "4641a85b8a4a09747f4e284be53f03dfcfcbb1c0b9706100e73644fbc8b359bc23508f" +
    "1b4350fe5e2da08a33cf0b5186ce83dd1bcc4a6d6240575d4d08d1e15922994f12ad44" +
    "743e271a76683f66a9273491da8a217dd25a870e37e227577cbd462e97b49c32b2399c" +
    "c2c9db2ba6955f0143cba62ce9e9b79f844220ad3e382caebd0880d273b3d7590a8ccd" +
    "f7d26c8a21c64d637d8d5c0dae178513231f532c0b26244d25610cd83931e42c3039e3" +
    "c15101104e40d53bf4c6f599322e2956e802551803757fde82593892798feaccbdc52b" +
    "495197f276c4858ae16253bb186872c4c87665bae41b1411b26c6ec636dad53619d183" +
    "d492d6996cc18cb6fad8cb7ef00889a88ce5438603d8b6e90a1cca4203b4d46b4942b5" +
    "9492af797c44f582730834be341178d5ef6e9f82e1caa440686525bf83c753e4a6beb9" +
    "254d1db68c15fbb34906871039f90644da1468493bf729211f308403a911943e066a98" +
    "081d8dd661bd97a6b9e774479d6861afcd048c2a17d70a481d5e38c067b42629bda1ac" +
    "eba8613ebb1827511545465025886b6510b622816f43f24b1d0300dcc2db24ca7cb02a" +
    "a6e583e5a6c0e8a7bde1110fd50e37d5557e865d9a66ad9c3d19d6f3a277c71abfa572" +
    "cb7a647954f5c0293bd298984483ab6ed65b2915921aadc0f98600870bea13668d21b1" +
    "a31d10ec28622bf9c28e23501846c0fa02ce7158aac4b7977d51debf1168cd03b7d49a" +
    "480c1b385c52d5a079a2be884e45b332003ca198963797a1c45eda0f9a0dce6f03869a" +
    "e78b937b819d38b7e1120d7fa9a8a96a9fd691d6c6f448a1ebb74862e95d8b7f3cf45d" +
    "99f2981f4f5622ea05d8fc094ec9a0670a2684622c556964e530c1372b442918856aa7" +
    "9494c199a6912ffa2a893c7e7e1c090892264d6e4b583281eb2dc252c61e4904382c56" +
    "f2c36f736a755b515aa2b108201bf1502de3228cf258700d8a7bec14f113e8d6be8daf" +
    "7796237a5cd9adda37ca201cd9c7f3dedc574b595f21c4865244e5dde5c5c5f330fa2e" +
    "58a988da0e223f0a42e41f9f9dd9908e82a86819ec690c5716ac00000000",
  pow: {
    limit: new bn_js_1.default(
      "01ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "hex"
    ),
    bits: 537001983,
    chainwork: new bn_js_1.default("01", "hex"),
    targetTimespan: 5 * 24 * 60 * 60,
    targetSpacing: 60,
    retargetInterval: 7200,
    targetReset: false,
    noRetargeting: false,
  },
  block: {
    bip34height: 0,
    bip34hash: b(""),
    bip65height: 0,
    bip65hash: b(""),
    bip66height: 0,
    bip66hash: b(""),
    pruneAfterHeight: 1000,
    keepBlocks: 288,
    maxTipAge: 24 * 60 * 60,
    slowHeight: 325000,
  },
  bip30: {},
  activationThreshold: 6048,
  minerWindow: 8064,
  deployments: {
    csv: {
      name: "csv",
      bit: 0,
      startTime: -1,
      timeout: 1493596800,
      threshold: -1,
      window: -1,
      required: false,
      force: true,
    },
    segwit: {
      name: "segwit",
      bit: 1,
      startTime: -1,
      timeout: 1510704000,
      threshold: -1,
      window: -1,
      required: true,
      force: false,
    },
    segsignal: {
      name: "segsignal",
      bit: 4,
      startTime: 1496275200,
      timeout: 1510704000,
      threshold: 269,
      window: 336,
      required: false,
      force: false,
    },
    testdummy: {
      name: "testdummy",
      bit: 28,
      startTime: -1,
      timeout: 1230767999,
      threshold: -1,
      window: -1,
      required: false,
      force: true,
    },
  },
  deploys: [],
  keyPrefix: {
    privkey: 0x7d,
    xpubkey: 0x0768acde,
    xprivkey: 0x0768feb1,
    xpubkey58: "xpub",
    xprivkey58: "xprv",
    coinType: 0,
  },
  addressPrefix: {
    pubkeyhash: 0x21,
    scripthash: 0x41,
    bech32: "tbc",
  },
  requireStandard: true,
  rpcPort: 8332,
  walletPort: 8334,
  minRelay: 1000,
  feeRate: 5000,
  maxFeeRate: 400000,
  selfConnect: false,
  requestMempool: false,
};
exports.MAINNET.deploys = [
  exports.MAINNET.deployments.csv,
  exports.MAINNET.deployments.segwit,
  exports.MAINNET.deployments.testdummy,
];
