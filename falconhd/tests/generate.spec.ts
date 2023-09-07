import { generate, fromMnemonic } from "../ts_src";
import { expect } from "chai";
import Mnemonic from "../ts_src/hd/mnemonic";
import { toHex } from "./utils";

describe("hd wallet", () => {
  it("should generate random wallet and have correct attributes", () => {
    const privateWallet = generate();

    expect(privateWallet.publicKey).to.have.length(898);
    expect(privateWallet.privateKey).to.have.length(1281);
    expect(privateWallet.depth).to.equal(0);
  });

  it("should generate the same wallet with the same mnemonic", () => {
    const mnemonic = new Mnemonic();

    const wallet1 = fromMnemonic(mnemonic);
    const wallet2 = fromMnemonic(mnemonic);

    expect(toHex(wallet1.privateKey)).to.equal(toHex(wallet2.privateKey));
  });

  it("should generate random wallets with random different keys", () => {
    const pk1 = toHex(generate().privateKey);
    const pk2 = toHex(generate().privateKey);

    expect(pk1).to.not.equal(pk2);
  });
});
