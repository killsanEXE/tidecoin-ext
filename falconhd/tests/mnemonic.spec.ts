import { expect } from "chai";
import Mnemonic from "../ts_src/hd/mnemonic";

describe("mnemonic", () => {
  it("should generate 36 words", () => {
    const mnemonic = new Mnemonic();
    expect(mnemonic.getPhrase().split(" ")).to.have.length(36);
  });
});
