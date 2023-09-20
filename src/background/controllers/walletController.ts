import StorageService from "@/background/services/storage"

export class WalletController {
    getVaultWallets = async () => {
        return await StorageService.loadVaultWallets();
    }
}

export default new WalletController();