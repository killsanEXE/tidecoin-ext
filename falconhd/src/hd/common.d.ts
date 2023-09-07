/// <reference types="node" />
import HDPrivateKey from "./private";
import HDPublicKey from "./public";
import { Buffer } from "buffer";
export declare const MIN_ENTROPY: number;
export declare const MAX_ENTROPY: number;
export declare const ZERO_KEY: Buffer;
export declare const ZERO_PRIVKEY: Buffer;
export declare const hash160: (value: string | Uint8Array) => Buffer;
export declare const hash256: (value: string | Uint8Array) => Buffer;
export declare const assert: (exp: boolean | number, message?: string) => boolean;
export declare const cache: import("tiny-lru").LRU<HDPublicKey | HDPrivateKey>;
export declare function parsePath(path: string): number[];
export declare const isMaster: (key: HDPrivateKey | HDPublicKey) => boolean;
export declare const isAccount: (key: HDPrivateKey | HDPublicKey, account?: number) => boolean;
