import { storageService } from "@/background/services";
import type { IAccount, IWallet, IWalletController } from "@/shared/interfaces";
import { fromMnemonic, fromPrivateKey } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { p2wpkh } from "tidecoinjs-lib/src/payments";
import { bytesToHex as toHex, hexToBytes as fromHex } from '@noble/hashes/utils'

export class WalletController implements IWalletController {

  async isVaultEmpty() {
    const values = await storageService.getLocalValues()
    return values.data === undefined;
  }

  async createNewWallet(exportedWallets: IWallet[], phrase: string, name?: string) {
    const mnemonic = Mnemonic.fromPhrase(phrase);
    const acc = fromMnemonic(mnemonic);
    const account: IAccount = {
      id: 0,
      name: "Account 1",
      balance: 0,
      privateKey: toHex(acc.privateKey),
      publicKey: toHex(acc.publicKey),
      address: p2wpkh({ pubkey: acc.publicKey }).address
    };
    const walletId = exportedWallets.length > 0 ? exportedWallets[exportedWallets.length - 1].id + 1 : 0;

    return {
      name: !name ? `Wallet ${walletId + 1}` : name,
      id: walletId,
      accounts: [account],
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

  async loadAccountsData(wallet: IWallet): Promise<IAccount[]> {
    let accountId = 0;
    const result: IAccount[] = []
    wallet.accounts.forEach((i) => {
      if (accountId === 0) {
        const imported = fromMnemonic(Mnemonic.fromPhrase(wallet.phrase))
        const address = p2wpkh({ pubkey: imported.publicKey }).address
        result.push({
          privateKey: toHex(imported.privateKey),
          publicKey: toHex(imported.publicKey),
          ...i,
          address
        })
      } else {
        const lastAcc = result.length > 1 ? result[-1] : result[0]
        const imported = fromPrivateKey(Buffer.from(fromHex((lastAcc.privateKey !== undefined ? lastAcc.privateKey : lastAcc.privateKey)!)), i.id)
        const address = p2wpkh({ pubkey: imported.derive(i.id - lastAcc.id).publicKey }).address
        result.push({
          privateKey: toHex(imported.privateKey),
          publicKey: toHex(imported.publicKey),
          ...i,
          address
        })
      }
      accountId += 1;
    })
    return result;
  }

  loadAccountData(account: IAccount): Partial<IAccount> {
    const imported = fromPrivateKey(Buffer.from(fromHex(account.privateKey!)), account.id).derive(account.id + 1);
    const address = p2wpkh({ pubkey: imported.publicKey }).address
    return {
      privateKey: toHex(imported.privateKey),
      publicKey: toHex(imported.publicKey),
      address
    }
  }

  async createNewAccount(wallet: IWallet, name?: string) {
    const accName = !name?.length ? `Account ${wallet.accounts.length + 1}` : name;
    const account = { id: wallet.accounts[wallet.accounts.length - 1].id + 1 };
    wallet.accounts.push(account);
    return {
      ...account,
      name: accName,
      balance: 0,
    };
  }

  generateMnemonicPhrase(): string {
    return new Mnemonic().getPhrase();
  }
}

export default new WalletController();
