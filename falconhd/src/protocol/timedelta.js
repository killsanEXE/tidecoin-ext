"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
const binary_1 = require("../utils/binary");
const EventEmitter = require("events");
class TimeData extends EventEmitter {
  constructor(limit = 200) {
    super();
    this.samples = [];
    this.known = new Map();
    this.offset = 0;
    this.checked = false;
    this.limit = limit;
  }
  add(id, time) {
    if (this.samples.length >= this.limit) return;
    if (this.known.has(id)) return;
    const sample = time - (0, util_1.now)();
    this.known.set(id, sample);
    (0, binary_1.insert)(this.samples, sample, compare);
    this.emit("sample", sample, this.samples.length);
    if (this.samples.length >= 5 && this.samples.length % 2 === 1) {
      let median = this.samples[this.samples.length >>> 1];
      if (Math.abs(median) >= 70 * 60) {
        if (!this.checked) {
          let match = false;
          for (const offset of this.samples) {
            if (offset !== 0 && Math.abs(offset) < 5 * 60) {
              match = true;
              break;
            }
          }
          if (!match) {
            this.checked = true;
            this.emit("mismatch");
          }
        }
        median = 0;
      }
      this.offset = median;
      this.emit("offset", this.offset);
    }
  }
  now() {
    return (0, util_1.now)() + this.offset;
  }
  adjust(time) {
    return time + this.offset;
  }
  local(time) {
    return time - this.offset;
  }
  ms() {
    return Date.now() + this.offset * 1000;
  }
}
function compare(a, b) {
  return a - b;
}
exports.default = TimeData;
