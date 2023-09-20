import StorageService from "@/background/services/storage"
import { toHex } from "@/shared/utils";
import IAccount from "@/ui/shared/interfaces/IAccount";
import { IWallet } from "@/ui/shared/interfaces/IWallet";
import { fromMnemonic } from "test-test-test-hd-wallet";
import Mnemonic from "test-test-test-hd-wallet/src/hd/mnemonic";

export class WalletController {

    getVaultWallets = async (): Promise<string[]> => {
        return await StorageService.loadVaultWallets();
    }
    createNewWallet = async (name?: string): Promise<IWallet> => {
        const mnemonic = new Mnemonic();
        const account: IAccount = { id: 0, name: "Account 1" }
        name = name === undefined ? `Wallet ${(await this.getVaultWallets()).length + 1}` : name;

        return {
            name,
            accounts: [account],
            currentAccount: account,
            phrase: mnemonic.getPhrase()
        }
    }

    saveWallets = async (wallets: IWallet[]) => {
        await StorageService.saveWallets(wallets);
    }
}

export default new WalletController();