import { ApprovalData, INotificationController } from "@/shared/interfaces/notification";
import { notificationService } from "../services";

class NotificationController implements INotificationController {
    async getApproval(): Promise<ApprovalData> {
        return notificationService.getApproval();
    }
}

export default new NotificationController();
