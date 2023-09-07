"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const sha256_1 = require("@noble/hashes/sha256");
const sha512_1 = require("@noble/hashes/sha512");
const pbkdf2_1 = require("@noble/hashes/pbkdf2");
const utils_1 = require("@noble/hashes/utils");
const words_1 = __importDefault(require("./words"));
const common_1 = require("./common");
const bufio_1 = require("@jil/bufio");
const buffer_1 = require("buffer");
const wordlistCache = Object.create(null);
const LANGUAGES = [
  "simplified chinese",
  "traditional chinese",
  "english",
  "french",
  "italian",
  "japanese",
  "spanish",
];
class Mnemonic {
  constructor(options) {
    this.bits = common_1.MIN_ENTROPY;
    this.language = "english";
    this.languages = LANGUAGES;
    if (options) this.fromOptions(options);
  }
  fromOptions(options) {
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
  static fromOptions(options) {
    return new this().fromOptions(options);
  }
  /**
   * Destroy the mnemonic (zeroes entropy).
   */
  destroy() {
    this.bits = common_1.MIN_ENTROPY;
    this.language = "english";
    if (this.entropy) {
      this.entropy = undefined;
    }
    this.phrase = undefined;
  }
  toSeed(passphrase) {
    if (!passphrase) passphrase = "";
    const phrase = this.getPhrase().normalize("NFKD");
    const passwd = `mnemonic${passphrase}`.normalize("NFKD");
    return buffer_1.Buffer.from(
      (0, pbkdf2_1.pbkdf2)(
        sha512_1.sha512,
        buffer_1.Buffer.from(phrase, "utf8"),
        buffer_1.Buffer.from(passwd, "utf8"),
        {
          dkLen: 64,
          c: 2048,
        }
      )
    );
  }
  getEntropy() {
    if (!this.entropy)
      this.entropy = buffer_1.Buffer.from(
        (0, utils_1.randomBytes)(this.bits / 8)
      );
    return this.entropy;
  }
  getPhrase() {
    if (this.phrase) return this.phrase;
    // Include the first `ENT / 32` bits
    // of the hash (the checksum).
    const wbits = this.bits + this.bits / 32;
    // Get entropy and checksum.
    const entropy = this.getEntropy();
    const chk = buffer_1.Buffer.from((0, sha256_1.sha256)(entropy));
    // Append the hash to the entropy to
    // make things easy when grabbing
    // the checksum bits.
    const size = Math.ceil(wbits / 8);
    const data = buffer_1.Buffer.allocUnsafe(size);
    entropy.copy(data, 0);
    chk.copy(data, entropy.length);
    // Build the mnemonic by reading
    // 11 bit indexes from the entropy.
    const list = Mnemonic.getWordlist(this.language);
    let phrase = [];
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
  fromPhrase(phrase) {
    (0, common_1.assert)(phrase.length <= 1000);
    const words = phrase.trim().split(/[\s\u3000]+/);
    const wbits = words.length * 11;
    const cbits = wbits % 32;
    (0, common_1.assert)(cbits !== 0, "Invalid checksum.");
    const bits = wbits - cbits;
    (0, common_1.assert)(bits >= common_1.MIN_ENTROPY);
    (0, common_1.assert)(bits <= common_1.MAX_ENTROPY);
    (0, common_1.assert)(bits % 32 === 0);
    const size = Math.ceil(wbits / 8);
    const data = buffer_1.Buffer.allocUnsafe(size);
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
    const chk2 = (0, sha256_1.sha256)(entropy);
    // Verify checksum.
    for (let i = 0; i < cbits; i++) {
      const bit = i % 8;
      const oct = (i - bit) / 8;
      const b1 = (chk1[oct] >>> (7 - bit)) & 1;
      const b2 = (chk2[oct] >>> (7 - bit)) & 1;
      if (b1 !== b2) throw new Error("Invalid checksum.");
    }
    (0, common_1.assert)(bits / 8 === entropy.length);
    this.bits = bits;
    this.language = lang;
    this.entropy = entropy;
    this.phrase = phrase;
    return this;
  }
  static fromPhrase(phrase) {
    return new this().fromPhrase(phrase);
  }
  fromEntropy(entropy, lang) {
    (0, common_1.assert)(entropy.length * 8 >= common_1.MIN_ENTROPY);
    (0, common_1.assert)(entropy.length * 8 <= common_1.MAX_ENTROPY);
    (0, common_1.assert)((entropy.length * 8) % 32 === 0);
    (0, common_1.assert)(!lang || this.languages.indexOf(lang) !== -1);
    this.entropy = entropy;
    this.bits = entropy.length * 8;
    if (lang) this.language = lang;
    return this;
  }
  static fromEntropy(entropy, lang) {
    return new this().fromEntropy(entropy, lang);
  }
  static getLanguage(word) {
    for (const lang of LANGUAGES) {
      const list = Mnemonic.getWordlist(lang);
      if (list.map[word] != null) return lang;
    }
    throw new Error("Could not determine language.");
  }
  static getWordlist(lang) {
    const cache = wordlistCache[lang];
    if (cache) return cache;
    const words = (0, words_1.default)(lang);
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
  fromJSON(json) {
    (0, common_1.assert)(json.bits >= common_1.MIN_ENTROPY);
    (0, common_1.assert)(json.bits <= common_1.MAX_ENTROPY);
    (0, common_1.assert)(json.bits % 32 === 0);
    (0, common_1.assert)(json.bits / 8 === json.entropy.length / 2);
    this.bits = json.bits;
    this.language = json.language;
    this.entropy = buffer_1.Buffer.from(json.entropy, "hex");
    this.phrase = json.phrase;
    return this;
  }
  static fromJSON(json) {
    return new this().fromJSON(json);
  }
  getSize() {
    let size = 0;
    size += 3;
    size += this.getEntropy().length;
    return size;
  }
  toWriter(bw) {
    const lang = LANGUAGES.indexOf(this.language);
    (0, common_1.assert)(lang !== -1);
    bw.writeU16(this.bits);
    bw.writeU8(lang);
    bw.writeBytes(this.getEntropy());
    return bw;
  }
  toRaw() {
    const size = this.getSize();
    return this.toWriter((0, bufio_1.write)(size)).render();
  }
  fromReader(br) {
    const bits = br.readU16();
    (0, common_1.assert)(bits >= common_1.MIN_ENTROPY);
    (0, common_1.assert)(bits <= common_1.MAX_ENTROPY);
    (0, common_1.assert)(bits % 32 === 0);
    const language = LANGUAGES[br.readU8()];
    (0, common_1.assert)(!!language);
    this.bits = bits;
    this.language = language;
    this.entropy = br.readBytes(bits / 8);
    return this;
  }
  fromRaw(data) {
    return this.fromReader((0, bufio_1.read)(data));
  }
  static fromReader(br) {
    return new this().fromReader(br);
  }
  static fromRaw(data) {
    return new this().fromRaw(data);
  }
  toString() {
    return this.getPhrase();
  }
  inspect() {
    return `<Mnemonic: ${this.getPhrase()}>`;
  }
  static isMnemonic(obj) {
    return obj instanceof Mnemonic;
  }
}
class WordList {
  constructor(words) {
    this.words = words;
    this.map = Object.create(null);
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      this.map[word] = i;
    }
  }
}
exports.default = Mnemonic;
