import { ApprovalData, INotificationController } from "@/shared/interfaces/notification";
import { notificationService, permissionService, sessionService, storageService } from "../services";

class NotificationController implements INotificationController {
    async getApproval(): Promise<ApprovalData> {
        return notificationService.getApproval();
    }

    async rejectApproval(err?: string, stay = false, isInternal = false): Promise<void> {
        notificationService.rejectApproval(err, stay, isInternal)
    }

    async resolveApproval(data?: any, forceReject = false): Promise<void> {
        notificationService.resolveApproval(data, forceReject)
    }

    async changedAccount() {
        permissionService.disconnectSites();
        sessionService.broadcastEvent("accountsChanged", storageService.currentAccount);
    }
}

export default new NotificationController();
