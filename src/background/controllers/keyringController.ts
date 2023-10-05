import { Psbt } from "tidecoinjs-lib";
import { keyringService } from "../services";
import { Hex, SendTDC } from "../services/keyring/types";
import { IKeyringController } from "@/shared/interfaces/keyringController";

class KeyringController implements IKeyringController {
  async init(password: string) {
    return await keyringService.init(password);
  }

  async newWallet(phrase: string) {
    return keyringService.newWallet(phrase);
  }

  async exportAccount(address: Hex) {
    return keyringService.exportAccount(address);
  }

  async getAccounts(address: Hex) {
    return keyringService.getAccounts(address);
  }

  async getKeyringForAccount(address: Hex) {
    return keyringService.getKeyringForAccount(address);
  }

  async signTransaction(tideTx: Psbt, address: string) {
    return keyringService.signTransaction(tideTx, address);
  }

  async signMessage(msgParams: { from: string; data: string }) {
    return keyringService.signMessage(msgParams);
  }

  async signPersonalMessage(msgParams: { from: string; data: string }) {
    return keyringService.signPersonalMessage(msgParams);
  }

  async sendTDC(data: SendTDC) {
    return await keyringService.sendTDC(data);
  }
}

export default new KeyringController();
