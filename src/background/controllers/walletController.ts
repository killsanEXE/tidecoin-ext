import { storageService } from "@/background/services";
import type { IAccount, IWallet, IWalletController } from "@/shared/interfaces";
import { fromMnemonic } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { p2wpkh } from "tidecoinjs-lib/src/payments";

export class WalletController implements IWalletController {

  async isVaultEmpty() {
    const values = await storageService.getLocalValues()
    return values.vault === undefined;
  }

  async createNewWallet(exportedWallets: IWallet[], name?: string) {
    const mnemonic = new Mnemonic();
    const account: IAccount = { id: 0, name: "Account 1", balance: 0 };
    const walletId = exportedWallets.length > 0 ? exportedWallets[exportedWallets.length - 1].id + 1 : 0;

    return {
      name: name === undefined ? `Wallet ${walletId + 1}` : name,
      id: walletId,
      accounts: [ account ],
      currentAccount: account,
      phrase: mnemonic.getPhrase(),
    };
  }

  async saveWallets(password: string, wallets: IWallet[]) {
    await storageService.saveWallets(password, wallets);
  }

  async importWallets(password: string) {
    return await storageService.importWallets(password);
  }

  async loadAccountPublicAddress(wallet: IWallet, account: IAccount) {
    const accIndex = wallet.accounts.indexOf(account);
    if (accIndex >= 0) return;
    const rootWallet = fromMnemonic(Mnemonic.fromPhrase(wallet.phrase));
    if (account.id === 0)
      return p2wpkh({ pubkey: rootWallet.publicKey }).address;
    return p2wpkh({ pubkey: rootWallet.derive(account.id).publicKey }).address;
  }

  async createNewAccount(wallet: IWallet, name?: string) {
    name = name === undefined ? `Account ${wallet.accounts.length}` : name;
    const account = { id: wallet.accounts[wallet.accounts.length - 1].id + 1 };
    wallet.accounts.push(account);
    return {
      ...account,
      address: await this.loadAccountPublicAddress(wallet, account),
      name: name,
      balance: 0,
    };
  }
}

export default new WalletController();
