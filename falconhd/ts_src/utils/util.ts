import { Buffer } from "buffer";

export function bench(time: [number, number]) {
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

export function now(): number {
  return Math.floor(Date.now() / 1000);
}

export function ms(): number {
  return Number(Date.now());
}

export function date(time?: number): string {
  if (time === undefined) time = now();

  return new Date(time! * 1000).toISOString().slice(0, -5) + "Z";
}

export function time(date?: string): number {
  if (date == null) return now();

  return (Number(new Date(date)) / 1000) | 0;
}

export function revHex(buf: Buffer): string {
  return Buffer.from(buf).reverse().toString("hex");
}

export function fromRev(str: string): Buffer {
  if ((str.length & 1) !== 0) throw new Error("Invalid rev");

  return Buffer.from(str, "hex").reverse();
}
