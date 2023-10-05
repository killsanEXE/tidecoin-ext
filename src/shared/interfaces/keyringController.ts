import { SendTDC } from "@/background/services/keyring/types";
import { Hex, Keyring } from "test-test-test-hd-wallet/src/hd/types";
import { Psbt } from "tidecoinjs-lib";
import { IPrivateWallet } from ".";

export interface IKeyringController {
  init(password: string): Promise<IPrivateWallet[]>;
  newWallet(phrase: string): Promise<string | undefined>;
  exportAccount(address: Hex): Promise<string>;
  getAccounts(address: Hex): Promise<string[]>;
  getKeyringForAccount(address: Hex): Promise<Keyring<any>>;
  signTransaction(tideTx: Psbt, address: string): Promise<void>;
  signMessage(msgParams: { from: string; data: string }): Promise<string>;
  signPersonalMessage(msgParams: {
    from: string;
    data: string;
  }): Promise<string>;
  sendTDC(data: SendTDC): Promise<string>;
}
