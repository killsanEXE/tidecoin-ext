import browser, { browserStorageLocalGet, browserStorageLocalSet } from "@/shared/utils/browser"
import { IWallet } from "@/ui/shared/interfaces/IWallet";
const passworder = require("browser-passworder");

class StorageService {
    loadVaultWallets = async () => {
        const vault = (await browserStorageLocalGet(undefined))["vault"];
        if (vault === undefined) return [];
        return vault;
    }

    saveWallets = async (password: string, wallets: IWallet[]) => {
        const walletsToSave = wallets.map(wallet => {
            return {
                name: wallet.name,
                phrase: wallet.phrase,
                accounts: wallet.accounts.map(account => ({ id: account.id, name: account.name || '' })),
            };
        });
        let encryptedWallets: string[] = [];
        for (let wallet of walletsToSave) {
            encryptedWallets.push(await passworder.encrypt(password, wallet));
        }

        await browserStorageLocalSet({ "vault": encryptedWallets });
    }

    imoprtWallets = async (password: string, wallets: string[]): Promise<IWallet[]> => {
        const decryptedWallets: IWallet[] = [];
        for (let wallet of wallets) {
            decryptedWallets.push(await passworder.decrypt(password, wallet));
        }
        return decryptedWallets;
    }
}

export default new StorageService();