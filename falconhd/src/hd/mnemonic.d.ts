/// <reference types="node" />
import { Language } from "./words";
import { BufferReader, StaticWriter } from "@jil/bufio";
import { Buffer } from "buffer";
interface MnemonicOptions {
    bit?: number;
    bits?: number;
    entropy?: Buffer;
    phrase?: string;
    language?: Language;
}
declare class Mnemonic {
    bits: number;
    language: Language;
    entropy?: Buffer;
    phrase?: string;
    languages: Language[];
    constructor(options?: MnemonicOptions);
    fromOptions(options: MnemonicOptions): Mnemonic;
    static fromOptions(options: MnemonicOptions): Mnemonic;
    /**
     * Destroy the mnemonic (zeroes entropy).
     */
    destroy(): void;
    toSeed(passphrase?: string): Buffer;
    getEntropy(): Buffer;
    getPhrase(): string;
    fromPhrase(phrase: string): this;
    static fromPhrase(phrase: string): Mnemonic;
    fromEntropy(entropy: Buffer, lang?: Language): this;
    static fromEntropy(entropy: Buffer, lang?: Language): Mnemonic;
    static getLanguage(word: string): Language;
    static getWordlist(lang: Language): any;
    toJSON(): {
        bits: number;
        language: Language;
        entropy: string;
        phrase: string;
    };
    fromJSON(json: {
        bits: number;
        language: Language;
        entropy: string;
        phrase: string;
    }): this;
    static fromJSON(json: any): Mnemonic;
    getSize(): number;
    toWriter(bw: StaticWriter): StaticWriter;
    toRaw(): Buffer;
    fromReader(br: BufferReader): this;
    fromRaw(data: Buffer): this;
    static fromReader(br: BufferReader): Mnemonic;
    static fromRaw(data: Buffer): Mnemonic;
    toString(): string;
    inspect(): string;
    static isMnemonic(obj: any): boolean;
}
export default Mnemonic;
