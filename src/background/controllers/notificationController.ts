import { ApprovalData, INotificationController } from "@/shared/interfaces/notification";
import { notificationService, permissionService, sessionService, storageService } from "../services";
import { ConnectedSite } from "../services/permission";

class NotificationController implements INotificationController {
    async getApproval(): Promise<ApprovalData> {
        return notificationService.getApproval();
    }

    async rejectApproval(err?: string, stay = false, isInternal = false): Promise<void> {
        notificationService.rejectApproval(err, stay, isInternal)
    }

    async resolveApproval(data?: any, forceReject = false): Promise<void> {
        const password = storageService.appState.password;
        if (notificationService.resolveApproval(data, forceReject) && password) {
            await storageService.saveWallets(password, storageService.walletState.wallets)
        }
    }

    async changedAccount(): Promise<void> {
        permissionService.disconnectSites();
        sessionService.broadcastEvent("accountsChanged", storageService.currentAccount);
    }

    async getConnectedSites(): Promise<ConnectedSite[]> {
        return permissionService.allSites;
    }

    async removeSite(origin: string): Promise<void> {
        const password = storageService.appState.password;
        if (password) {
            permissionService.removeSite(origin);
            await storageService.saveWallets(password, storageService.walletState.wallets);

        }
    }
}

export default new NotificationController();
