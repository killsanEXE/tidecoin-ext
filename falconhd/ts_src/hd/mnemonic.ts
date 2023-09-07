import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from "@noble/hashes/sha512";
import { pbkdf2 } from "@noble/hashes/pbkdf2";
import { randomBytes } from "@noble/hashes/utils";

import wordlist, { Language } from "./words";
import { MAX_ENTROPY, MIN_ENTROPY, assert } from "./common";
import { BufferReader, StaticWriter, read, write } from "@jil/bufio";
import { Buffer } from "buffer";

const wordlistCache = Object.create(null);

interface MnemonicOptions {
  bit?: number;
  bits?: number;
  entropy?: Buffer;
  phrase?: string;
  language?: Language;
}

const LANGUAGES: Language[] = [
  "simplified chinese",
  "traditional chinese",
  "english",
  "french",
  "italian",
  "japanese",
  "spanish",
];

class Mnemonic {
  bits = MIN_ENTROPY;
  language: Language = "english";
  entropy?: Buffer;
  phrase?: string;
  languages = LANGUAGES;

  constructor(options?: MnemonicOptions) {
    if (options) this.fromOptions(options);
  }

  fromOptions(options: MnemonicOptions): Mnemonic {
    if (options.bits !== undefined) {
      this.bits = options.bits;
    }

    if (options.language) {
      this.language = options.language;
    }

    if (options.phrase) {
      this.fromPhrase(options.phrase);
      return this;
    }

    if (options.entropy) {
      this.fromEntropy(options.entropy, this.language);
      return this;
    }

    return this;
  }

  static fromOptions(options: MnemonicOptions): Mnemonic {
    return new this().fromOptions(options);
  }

  /**
   * Destroy the mnemonic (zeroes entropy).
   */

  destroy() {
    this.bits = MIN_ENTROPY;
    this.language = "english";
    if (this.entropy) {
      this.entropy = undefined;
    }
    this.phrase = undefined;
  }

  toSeed(passphrase?: string): Buffer {
    if (!passphrase) passphrase = "";

    const phrase = this.getPhrase().normalize("NFKD");
    const passwd = `mnemonic${passphrase}`.normalize("NFKD");

    return Buffer.from(
      pbkdf2(sha512, Buffer.from(phrase, "utf8"), Buffer.from(passwd, "utf8"), {
        dkLen: 64,
        c: 2048,
      })
    );
  }

  getEntropy(): Buffer {
    if (!this.entropy) this.entropy = Buffer.from(randomBytes(this.bits / 8));
    return this.entropy;
  }

  getPhrase(): string {
    if (this.phrase) return this.phrase;

    // Include the first `ENT / 32` bits
    // of the hash (the checksum).
    const wbits = this.bits + this.bits / 32;

    // Get entropy and checksum.
    const entropy = this.getEntropy();
    const chk = Buffer.from(sha256(entropy));

    // Append the hash to the entropy to
    // make things easy when grabbing
    // the checksum bits.
    const size = Math.ceil(wbits / 8);
    const data = Buffer.allocUnsafe(size);
    entropy.copy(data, 0);
    chk.copy(data, entropy.length);

    // Build the mnemonic by reading
    // 11 bit indexes from the entropy.
    const list = Mnemonic.getWordlist(this.language);

    let phrase: string[] | string = [];
    for (let i = 0; i < wbits / 11; i++) {
      let index = 0;
      for (let j = 0; j < 11; j++) {
        const pos = i * 11 + j;
        const bit = pos % 8;
        const oct = (pos - bit) / 8;
        index <<= 1;
        index |= (data[oct] >>> (7 - bit)) & 1;
      }
      phrase.push(list.words[index]);
    }

    // Japanese likes double-width spaces.
    if (this.language === "japanese") phrase = phrase.join("\u3000");
    else phrase = phrase.join(" ");

    this.phrase = phrase;

    return phrase;
  }

  fromPhrase(phrase: string) {
    assert(phrase.length <= 1000);

    const words = phrase.trim().split(/[\s\u3000]+/);
    const wbits = words.length * 11;
    const cbits = wbits % 32;

    assert(cbits !== 0, "Invalid checksum.");

    const bits = wbits - cbits;

    assert(bits >= MIN_ENTROPY);
    assert(bits <= MAX_ENTROPY);
    assert(bits % 32 === 0);

    const size = Math.ceil(wbits / 8);
    const data = Buffer.allocUnsafe(size);
    data.fill(0);

    const lang = Mnemonic.getLanguage(words[0]);
    const list = Mnemonic.getWordlist(lang);

    // Rebuild entropy bytes.
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const index = list.map[word];

      if (index == null) throw new Error("Could not find word.");

      for (let j = 0; j < 11; j++) {
        const pos = i * 11 + j;
        const bit = pos % 8;
        const oct = (pos - bit) / 8;
        const val = (index >>> (10 - j)) & 1;
        data[oct] |= val << (7 - bit);
      }
    }

    const cbytes = Math.ceil(cbits / 8);
    const entropy = data.subarray(0, data.length - cbytes);
    const chk1 = data.subarray(data.length - cbytes);
    const chk2 = sha256(entropy);

    // Verify checksum.
    for (let i = 0; i < cbits; i++) {
      const bit = i % 8;
      const oct = (i - bit) / 8;
      const b1 = (chk1[oct] >>> (7 - bit)) & 1;
      const b2 = (chk2[oct] >>> (7 - bit)) & 1;
      if (b1 !== b2) throw new Error("Invalid checksum.");
    }

    assert(bits / 8 === entropy.length);

    this.bits = bits;
    this.language = lang;
    this.entropy = entropy;
    this.phrase = phrase;

    return this;
  }

  static fromPhrase(phrase: string): Mnemonic {
    return new this().fromPhrase(phrase);
  }

  fromEntropy(entropy: Buffer, lang?: Language) {
    assert(entropy.length * 8 >= MIN_ENTROPY);
    assert(entropy.length * 8 <= MAX_ENTROPY);
    assert((entropy.length * 8) % 32 === 0);
    assert(!lang || this.languages.indexOf(lang) !== -1);

    this.entropy = entropy;
    this.bits = entropy.length * 8;

    if (lang) this.language = lang;

    return this;
  }

  static fromEntropy(entropy: Buffer, lang?: Language): Mnemonic {
    return new this().fromEntropy(entropy, lang);
  }

  static getLanguage(word: string): Language {
    for (const lang of LANGUAGES) {
      const list = Mnemonic.getWordlist(lang);
      if (list.map[word] != null) return lang;
    }

    throw new Error("Could not determine language.");
  }

  static getWordlist(lang: Language): any {
    const cache = wordlistCache[lang];

    if (cache) return cache;

    const words = wordlist(lang);
    const list = new WordList(words);

    wordlistCache[lang] = list;

    return list;
  }

  toJSON() {
    return {
      bits: this.bits,
      language: this.language,
      entropy: this.getEntropy().toString("hex"),
      phrase: this.getPhrase(),
    };
  }

  fromJSON(json: {
    bits: number;
    language: Language;
    entropy: string;
    phrase: string;
  }) {
    assert(json.bits >= MIN_ENTROPY);
    assert(json.bits <= MAX_ENTROPY);
    assert(json.bits % 32 === 0);
    assert(json.bits / 8 === json.entropy.length / 2);

    this.bits = json.bits;
    this.language = json.language;
    this.entropy = Buffer.from(json.entropy, "hex");
    this.phrase = json.phrase;

    return this;
  }

  static fromJSON(json: any) {
    return new this().fromJSON(json);
  }

  getSize(): number {
    let size = 0;
    size += 3;
    size += this.getEntropy().length;
    return size;
  }

  toWriter(bw: StaticWriter) {
    const lang = LANGUAGES.indexOf(this.language);

    assert(lang !== -1);

    bw.writeU16(this.bits);
    bw.writeU8(lang);
    bw.writeBytes(this.getEntropy());

    return bw;
  }

  toRaw(): Buffer {
    const size = this.getSize();
    return this.toWriter(write(size)).render();
  }

  fromReader(br: BufferReader) {
    const bits = br.readU16();

    assert(bits >= MIN_ENTROPY);
    assert(bits <= MAX_ENTROPY);
    assert(bits % 32 === 0);

    const language = LANGUAGES[br.readU8()];
    assert(!!language);

    this.bits = bits;
    this.language = language;
    this.entropy = br.readBytes(bits / 8);

    return this;
  }

  fromRaw(data: Buffer) {
    return this.fromReader(read(data));
  }

  static fromReader(br: BufferReader): Mnemonic {
    return new this().fromReader(br);
  }

  static fromRaw(data: Buffer): Mnemonic {
    return new this().fromRaw(data);
  }

  toString(): string {
    return this.getPhrase();
  }

  inspect() {
    return `<Mnemonic: ${this.getPhrase()}>`;
  }

  static isMnemonic(obj: any): boolean {
    return obj instanceof Mnemonic;
  }
}

class WordList {
  words: string[];
  map: Record<string, number>;

  constructor(words: string[]) {
    this.words = words;
    this.map = Object.create(null);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      this.map[word] = i;
    }
  }
}

export default Mnemonic;
