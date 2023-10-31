import { Psbt } from "tidecoinjs-lib";
import { keyringService } from "../services";
import { Hex, SendTDC } from "../services/keyring/types";
import { IPrivateWallet } from "@/shared/interfaces";
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";

export interface IKeyringController {
  init(password: string): Promise<IPrivateWallet[]>;
  newKeyring(type: "simple" | "root", payload: string): Promise<string | undefined>;
  exportAccount(address: Hex): Promise<string>;
  signTransaction(tideTx: Psbt, address: string): Promise<void>;
  signMessage(msgParams: { from: string; data: string }): Promise<string>;
  signPersonalMessage(msgParams: { from: string; data: string }): Promise<string>;
  sendTDC(data: SendTDC): Promise<string>;
  changeAddressType(walletIndex: number, addressType: AddressType): Promise<string[]>;
  exportPublicKey(address: string): Promise<string>;
  serializeKeyringById(index: number): Promise<any>;
}

class KeyringController implements IKeyringController {
  /**
   * Method should be called after user typed a password
   * @param {string} password Password that used on creating account
   * @returns {Promise<IPrivateWallet[]>} List of imported accounts that was initialized
   */
  async init(password: string): Promise<IPrivateWallet[]> {
    return await keyringService.init(password);
  }

  /**
   * Method should be called to create a new wallet from mnemonic
   * @param {"simple" | "root"} type Type of wallet that should be created
   * @param {string} payload Phrases string words separated by space that generated for wallet or private key hex format
   * @returns {Promise<string | undefined>} P2PWKH address of created wallet
   */
  async newKeyring(type: "simple" | "root", payload: string): Promise<string | undefined> {
    return await keyringService.newKeyring(type, payload);
  }

  /**
   * Method exports private key of selected account
   * @param {Hex} address P2WPKH address of account
   * @returns {Promise<string>} WIF representation of private key
   */
  async exportAccount(address: Hex): Promise<string> {
    return await keyringService.exportAccount(address);
  }

  /**
   * Method should be used to sign a new transaction before broadcasting it
   * @param {Psbt} tideTx Psbt builded transaction with inputs that should be signed
   * @param {string} address address of account that should be used to sign inputs
   * @returns {Promise<void>} Method mutate input transaction and with that returns nothing
   */
  async signTransaction(tideTx: Psbt, address: string): Promise<void> {
    return keyringService.signTransaction(tideTx, address);
  }

  async signMessage(msgParams: { from: string; data: string }) {
    return await keyringService.signMessage(msgParams);
  }

  async signPersonalMessage(msgParams: { from: string; data: string }) {
    return await keyringService.signPersonalMessage(msgParams);
  }

  /**
   * Method should be used to create hex of transaction and sigs all inputs
   * @param {SendTDC} data Input data for the transaction
   * @returns {Promise<string>} Hex of transaction to push transaction to the blockchain with
   */
  async sendTDC(data: SendTDC): Promise<string> {
    return await keyringService.sendTDC(data);
  }

  async exportPublicKey(address: string): Promise<string> {
    return keyringService.exportPublicKey(address);
  }

  async changeAddressType(walletIndex: number, addressType: AddressType): Promise<string[]> {
    return await keyringService.changeAddressType(walletIndex, addressType);
  }

  async serializeKeyringById(index: number) {
    return keyringService.serializeById(index);
  }
}

export default new KeyringController();
