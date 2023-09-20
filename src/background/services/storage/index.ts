import browser, { browserStorageLocalGet } from "@/shared/utils/browser"

class StorageService {
    loadVaultWallets = async () => {
        return await browserStorageLocalGet(undefined);
    }
}

export default new StorageService();