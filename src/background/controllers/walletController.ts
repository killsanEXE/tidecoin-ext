import { storageService } from "@/background/services";
import type { IAccount, IWallet, IWalletController } from "@/shared/interfaces";
import { HDPrivateKey, SimpleKey } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";
import keyringService from "@/background/services/keyring";
import { extractKeysFromObj } from "@/shared/utils";
import { DecryptedSecrets } from "../services/storage/types";
import { AddressType } from "test-test-test-hd-wallet/src/hd/types";

class WalletController implements IWalletController {
  async isVaultEmpty() {
    const values = await storageService.getLocalValues();
    return values.enc === undefined;
  }

  async createNewWallet(phrase: string, name?: string, addressType?: AddressType): Promise<IWallet> {
    const exportedWallets = storageService.walletState.wallets;
    const address = keyringService.newKeyring("root", phrase);
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
      addressType: addressType ? addressType : AddressType.P2WPKH,
      accounts: [account],
    };
  }

  async saveWallets(data?: DecryptedSecrets) {
    await storageService.saveWallets(
      storageService.appState.password!,
      storageService.walletState.wallets,
      data
    );
  }

  async importWallets(password: string) {
    const wallets = await keyringService.init(password);
    return wallets.map((i) => extractKeysFromObj(i, ["data"]));
  }

  async loadAccountsData(
    walletId: number,
    accounts: IAccount[]
  ): Promise<IAccount[]> {
    const wallet = keyringService.keyrings[walletId] as
      | HDPrivateKey
      | SimpleKey;

    const addresses = wallet.getAccounts();

    return accounts.map((i) => ({
      ...i,
      address: addresses[i.id],
    }));
  }

  async createNewAccount(name?: string): Promise<IAccount> {
    const wallet = storageService.currentWallet;
    if (!wallet) return {} as any;
    const accName = !name?.length
      ? `Account ${wallet.accounts.length + 1}`
      : name;
    const addresses = keyringService.getKeyringForAccount(
      wallet.accounts[-1] ? wallet.accounts[-1].address! : wallet.accounts[0].address!
    ).addAccounts!(1);

    return {
      id: wallet.accounts[wallet.accounts.length - 1].id + 1,
      name: accName,
      balance: 0,
      address: addresses[0],
    };
  }

  async generateMnemonicPhrase(): Promise<string> {
    const randomSeed = crypto.getRandomValues(new Uint8Array(16));
    return new Mnemonic().getPhrase(randomSeed);
  }
}

export default new WalletController();
