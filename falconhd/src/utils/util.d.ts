/// <reference types="node" />
import { Buffer } from "buffer";
export declare function bench(time: [number, number]): number | number[];
export declare function now(): number;
export declare function ms(): number;
export declare function date(time?: number): string;
export declare function time(date?: string): number;
export declare function revHex(buf: Buffer): string;
export declare function fromRev(str: string): Buffer;
