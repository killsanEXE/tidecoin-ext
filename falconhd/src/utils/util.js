"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromRev =
  exports.revHex =
  exports.time =
  exports.date =
  exports.ms =
  exports.now =
  exports.bench =
    void 0;
const buffer_1 = require("buffer");
function bench(time) {
  if (!process.hrtime) {
    const now = Date.now();
    if (time) {
      const [hi, lo] = time;
      const start = hi * 1000 + lo / 1e6;
      return now - start;
    }
    const ms = now % 1000;
    // Seconds
    const hi = (now - ms) / 1000;
    // Nanoseconds
    const lo = ms * 1e6;
    return [hi, lo];
  }
  if (time) {
    const [hi, lo] = process.hrtime(time);
    return hi * 1000 + lo / 1e6;
  }
  return process.hrtime();
}
exports.bench = bench;
function now() {
  return Math.floor(Date.now() / 1000);
}
exports.now = now;
function ms() {
  return Number(Date.now());
}
exports.ms = ms;
function date(time) {
  if (time === undefined) time = now();
  return new Date(time * 1000).toISOString().slice(0, -5) + "Z";
}
exports.date = date;
function time(date) {
  if (date == null) return now();
  return (Number(new Date(date)) / 1000) | 0;
}
exports.time = time;
function revHex(buf) {
  return buffer_1.Buffer.from(buf).reverse().toString("hex");
}
exports.revHex = revHex;
function fromRev(str) {
  if ((str.length & 1) !== 0) throw new Error("Invalid rev");
  return buffer_1.Buffer.from(str, "hex").reverse();
}
exports.fromRev = fromRev;
