import { useNavigate } from "react-router-dom";
import { useControllersState } from "../states/controllerState";
import { useEffect } from "react";
import { isNotification } from "../utils";

export const useApproval = () => {
    const navigate = useNavigate();
    const { notificationController } = useControllersState((v) => ({
        notificationController: v.notificationController
    }))

    const resolveApproval = async (data?: any, stay = false, forceReject = false) => {
        const approval = await notificationController.getApproval();

        if (approval) {
            await notificationController.resolveApproval(data, forceReject);
        }
        if (stay) {
            return;
        }
        setTimeout(() => {
            navigate('/');
        });
    };

    const rejectApproval = async (err?, stay = false, isInternal = false) => {
        const approval = await await notificationController.getApproval();
        if (approval) {
            await notificationController.rejectApproval(err, stay, isInternal);
        }
        if (!stay) {
            navigate('/');
        }
    };

    useEffect(() => {
        if (!isNotification()) {
            return;
        }
        window.addEventListener('beforeunload', rejectApproval);

        return () => window.removeEventListener('beforeunload', rejectApproval);
    }, []);

    return [notificationController, resolveApproval, rejectApproval] as const;
};