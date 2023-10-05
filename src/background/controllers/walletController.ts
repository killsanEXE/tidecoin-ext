import { storageService } from "@/background/services";
import type {
  IAccount,
  IPrivateWallet,
  IWallet,
  IWalletController,
} from "@/shared/interfaces";
import { fromMnemonic } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { extractKeysFromObj } from "@/shared/utils";
import keyringService from "@/background/services/keyring";

export class WalletController implements IWalletController {
  async isVaultEmpty() {
    const values = await storageService.getLocalValues();
    return values.enc === undefined;
  }

  async createNewWallet(
    exportedWallets: IWallet[],
    phrase: string,
    name?: string
  ): Promise<IPrivateWallet> {
    const address = keyringService.newWallet(phrase);
    const account: IAccount = {
      id: 0,
      name: "Account 1",
      balance: 0,
      address,
    };
    const walletId =
      exportedWallets.length > 0
        ? exportedWallets[exportedWallets.length - 1].id + 1
        : 0;

    return {
      name: !name ? `Wallet ${walletId + 1}` : name,
      id: walletId,
      accounts: [account],
      currentAccount: account,
      phrase,
    };
  }

  async saveWallets(password: string, wallets: IPrivateWallet[]) {
    await storageService.saveWallets(password, wallets);
  }

  async importWallets(password: string) {
    const wallets = await keyringService.init(password);

    return wallets.map((i) => extractKeysFromObj(i, ["phrase", "privateKey"]));
  }

  async loadAccountsData(rootWallet: IPrivateWallet): Promise<IAccount[]> {
    if (!rootWallet.phrase) throw new Error("Wallet should contains phrase");

    const result: IAccount[] = [];
    const root = fromMnemonic(Mnemonic.fromPhrase(rootWallet.phrase));
    const idx = rootWallet.accounts.length > 1 ? -1 : 0;
    const addresses = root.addAccounts(rootWallet.accounts[idx].id + 1);
    rootWallet.accounts.forEach((acc) => {
      if (acc.id === 0)
        result.push({
          ...acc,
          address: root.getAccounts()[0],
        });
      else result.push({ ...acc, address: addresses[acc.id] });
    });
    return result;
  }

  async createNewAccount(wallet: IWallet, name?: string): Promise<IAccount> {
    const accName = !name?.length
      ? `Account ${wallet.accounts.length + 1}`
      : name;
    const addresses = keyringService.getKeyringForAccount(
      wallet.accounts[-1].address!
    ).addAccounts!(1);
    const account = {
      id: wallet.accounts[wallet.accounts.length - 1].id + 1,
    };
    wallet.accounts.push(account);
    return {
      ...account,
      name: accName,
      balance: 0,
      address: addresses[0],
    };
  }

  generateMnemonicPhrase(): string {
    const randomSeed = crypto.getRandomValues(new Uint8Array(16));
    return new Mnemonic().getPhrase(randomSeed);
  }
}

export default new WalletController();
