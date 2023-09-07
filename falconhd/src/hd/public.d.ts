/// <reference types="node" />
import { Base58String, PublicKeyOptions } from "./types";
import { NetType } from "../protocol/types";
import { BufferReader, StaticWriter } from "@jil/bufio";
import { Buffer } from "buffer";
declare class HDPublicKey {
    depth: number;
    parentFingerPrint: number;
    childIndex: number;
    chainCode: Buffer;
    publicKey: Buffer;
    fingerPrint: number;
    constructor(options?: PublicKeyOptions);
    fromOptions(options: PublicKeyOptions): HDPublicKey;
    static fromOptions(options: PublicKeyOptions): HDPublicKey;
    toPublic(): HDPublicKey;
    xpubkey(network?: NetType): Base58String;
    /**
     * Destroy the key (zeroes chain code and pubkey).
     */
    destroy(): void;
    derive(index: number): HDPublicKey;
    getID(index: number): string;
    deriveAccount(account: number): HDPublicKey;
    isMaster(): boolean;
    isAccount(account?: number): boolean;
    static isValidPath(path: string): boolean;
    derivePath(path: string): HDPublicKey;
    equals(obj: HDPublicKey): boolean;
    compare(key: PublicKeyOptions): number | undefined;
    toJSON(network?: NetType): {
        xpubkey: string;
    };
    fromJSON(json: {
        xpubkey: string;
    }, network?: NetType): HDPublicKey;
    static fromJSON(json: {
        xpubkey: string;
    }, network?: NetType): HDPublicKey;
    static isBase58(data: string, network?: NetType): boolean;
    static isRaw(data: Buffer, network?: NetType): boolean;
    fromBase58(xkey: Base58String, network?: NetType): HDPublicKey;
    fromReader(br: BufferReader, network?: NetType): HDPublicKey;
    fromRaw(data: Buffer, network?: NetType): HDPublicKey;
    toBase58(network?: NetType): Base58String;
    toWriter(bw: StaticWriter, network?: NetType): StaticWriter;
    getSize(): number;
    toRaw(network?: NetType): Buffer;
    static fromBase58(xkey: Base58String, network?: NetType): HDPublicKey;
    static fromReader(br: BufferReader, network?: NetType): HDPublicKey;
    static fromRaw(data: Buffer, network?: NetType): HDPublicKey;
}
export default HDPublicKey;
