/// <reference types="node" />
import TimeData from "./timedelta";
import { NetType } from "./types";
import { Buffer } from "buffer";
declare class Network {
    network: NetType;
    checkpoints: {
        hash: Buffer;
        height: number;
    }[];
    unknownBits: unknown;
    time: TimeData;
    constructor(network?: NetType);
    init(): void;
    byBit(bit: number): unknown;
    now(): number;
    ms(): number;
    static by(value: string | number, compare: (v1: any, v2: any) => boolean, network?: NetType, name?: string): Network;
    static fromMagic(value: number, network?: NetType): Network;
    static fromWIF(prefix: number, network?: NetType): Network;
    static fromPublic(prefix: number, network?: NetType): Network;
    static fromPrivate(prefix: number, network?: NetType): Network;
    static fromPublic58(prefix: string, network?: NetType): Network;
    static fromPrivate58(prefix: string, network?: NetType): Network;
    static fromBase58(prefix: number, network?: NetType): Network;
    static fromBech32(hrp: string, network?: NetType): Network;
    static fromBech32m(hrp: string, network?: NetType): Network;
    toString(): string;
    inspect(): string;
    static isNetwork(obj: unknown): boolean;
}
export default Network;
