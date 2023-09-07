/// <reference types="node" />
import { NetType } from "../protocol/types";
import Mnemonic from "./mnemonic";
import HDPrivateKey from "./private";
import HDPublicKey from "./public";
import { Buffer } from "buffer";
export declare function fromBase58(xkey: string, network?: NetType): HDPublicKey | HDPrivateKey;
export declare function generate(): HDPrivateKey;
export declare function fromSeed(options: Buffer): HDPrivateKey;
export declare function fromMnemonic(options: Mnemonic): HDPrivateKey;
export declare function fromJSON(json: {
    xprivkey?: string;
    xpubkey?: string;
}, network?: NetType): HDPrivateKey | HDPublicKey;
export declare function fromRaw(data: Buffer, network?: NetType): HDPrivateKey | HDPublicKey;
export declare function from(options: any, network?: NetType): HDPrivateKey | HDPublicKey;
export declare function isBase58(data: string, network?: NetType): boolean;
export declare function isRaw(data: Buffer, network?: NetType): boolean;
