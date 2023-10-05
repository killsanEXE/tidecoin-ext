import { storageService } from "@/background/services";
import type {
  IAccount,
  IPrivateWallet,
  IWallet,
  IWalletController,
} from "@/shared/interfaces";
import { fromMnemonic } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import { payments } from "tidecoinjs-lib";
import { falconPairFactory } from "tidepair";
import {
  bytesToHex as toHex,
  hexToBytes as fromHex,
} from "@noble/hashes/utils";
import { extractKeysFromObj } from "@/shared/utils";

const falconPair = falconPairFactory();

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
    const mnemonic = Mnemonic.fromPhrase(phrase);
    const acc = fromMnemonic(mnemonic);
    const account: IAccount = {
      id: 0,
      name: "Account 1",
      balance: 0,
      privateKey: toHex(acc.privateKey),
      publicKey: toHex(acc.publicKey),
      address: payments.p2wpkh({ pubkey: Buffer.from(acc.publicKey) }).address,
    };
    const walletId =
      exportedWallets.length > 0
        ? exportedWallets[exportedWallets.length - 1].id + 1
        : 0;

    const randomSeed = crypto.getRandomValues(new Uint8Array(16));

    return {
      name: !name ? `Wallet ${walletId + 1}` : name,
      id: walletId,
      accounts: [account],
      currentAccount: account,
      phrase: mnemonic.getPhrase(randomSeed),
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
    const addresses = await root.addAccounts(
      rootWallet.accounts[-1]
        ? rootWallet.accounts[-1].id + 1
        : rootWallet.accounts[0].id + 1
    );
    rootWallet.accounts.forEach((acc) => {
      if (acc.id === 0)
        result.push({
          ...acc,
          address: payments.p2wpkh({ pubkey: Buffer.from(root.publicKey) })
            .address,
        });
      else result.push({ ...acc, address: addresses[acc.id] });
    });
    return result;
  }

  async loadAccountData(account: IAccount): Promise<Partial<IAccount>> {
    const imported = falconPair.fromPrivateKey(
      Buffer.from(fromHex(account.privateKey!))
    );
    const address = payments.p2wpkh({ pubkey: imported.publicKey }).address;
    return {
      privateKey: toHex(imported.privateKey),
      publicKey: toHex(imported.publicKey),
      address,
    };
  }

  async createNewAccount(wallet: IWallet, name?: string) {
    const accName = !name?.length
      ? `Account ${wallet.accounts.length + 1}`
      : name;
    const account = { id: wallet.accounts[wallet.accounts.length - 1].id + 1 };
    wallet.accounts.push(account);
    return {
      ...account,
      name: accName,
      balance: 0,
    };
  }

  generateMnemonicPhrase(): string {
    const randomSeed = crypto.getRandomValues(new Uint8Array(16));
    return new Mnemonic().getPhrase(randomSeed);
  }
}

export default new WalletController();
