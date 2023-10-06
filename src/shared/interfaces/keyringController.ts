import { SendTDC } from "@/background/services/keyring/types";
import { AddressType, Hex } from "test-test-test-hd-wallet/src/hd/types";
import { Psbt } from "tidecoinjs-lib";
import { IPrivateWallet } from ".";

export interface IKeyringController {
  init(password: string): Promise<IPrivateWallet[]>;
  newKeyring(
    type: "simple" | "root",
    payload: string
  ): Promise<string | undefined>;
  exportAccount(address: Hex): Promise<string>;
  signTransaction(tideTx: Psbt, address: string): Promise<void>;
  signMessage(msgParams: { from: string; data: string }): Promise<string>;
  signPersonalMessage(msgParams: {
    from: string;
    data: string;
  }): Promise<string>;
  sendTDC(data: SendTDC): Promise<string>;
  changeAddressType(walletIndex: number, addressType: AddressType): Promise<string[]>
}
