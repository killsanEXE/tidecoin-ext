import BN from "bn.js";
import { Buffer } from "buffer";

interface Deployment {
  name: string;
  bit: number;
  startTime: number;
  timeout: number;
  threshold: number;
  window: number;
  required: boolean;
  force: boolean;
}

interface Genesis {
  version: number;
  hash: Buffer;
  prevBlock: Buffer;
  merkleRoot: Buffer;
  time: number;
  bits: number;
  nonce: number;
  height: number;
}

interface Pow {
  limit: BN;
  bits: number;
  chainwork: BN;
  targetTimespan: number;
  targetSpacing: number;
  retargetInterval: number;
  targetReset: boolean;
  noRetargeting: boolean;
}

interface Block {
  bip34height: number;
  bip34hash: Buffer;
  bip65height: number;
  bip65hash: Buffer;
  bip66height: number;
  bip66hash: Buffer;
  pruneAfterHeight: number;
  keepBlocks: number;
  maxTipAge: number;
  slowHeight: number;
}

interface KeyPrefix {
  privkey: number;
  xpubkey: number;
  xprivkey: number;
  xpubkey58: string;
  xprivkey58: string;
  coinType: number;
}

interface AddressPrefix {
  pubkeyhash: number;
  scripthash: number;
  bech32: string;
}

export type NetworkType = "main" | "testnet";

export interface NetType {
  type: NetworkType;
  seeds: string[];
  magic: number;
  port: number;
  checkpointMap: Record<number, Buffer>;
  lastCheckpoint: number;
  halvingInterval: number;
  genesis: Genesis;
  genesisBlock: string;
  pow: Pow;
  block: Block;
  bip30: {};
  activationThreshold: number;
  minerWindow: number;
  deployments: Record<string, Deployment>;
  deploys: Deployment[];
  keyPrefix: KeyPrefix;
  addressPrefix: AddressPrefix;
  requireStandard: true;
  rpcPort: number;
  walletPort: number;
  minRelay: number;
  feeRate: number;
  maxFeeRate: number;
  selfConnect: boolean;
  requestMempool: boolean;
}
