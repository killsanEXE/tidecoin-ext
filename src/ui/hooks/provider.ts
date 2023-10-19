import { useNavigate } from "react-router-dom";
import { useControllersState } from "../states/controllerState";

export const useApproval = () => {
    const navigate = useNavigate();
    const { notificationController } = useControllersState((v) => ({
        notificationController: v.notificationController
    }))

    const resolveApproval = async (data?: any, stay = false, forceReject = false) => {
        const approval = await notificationController.getApproval();

        if (approval) {
            wallet.resolveApproval(data, forceReject);
        }
        if (stay) {
            return;
        }
        setTimeout(() => {
            navigate('/');
        });
    };

    const rejectApproval = async (err?, stay = false, isInternal = false) => {
        const approval = await getApproval();
        if (approval) {
            await wallet.rejectApproval(err, stay, isInternal);
        }
        if (!stay) {
            navigate('/');
        }
    };

    useEffect(() => {
        if (!getUiType().isNotification) {
            return;
        }
        window.addEventListener('beforeunload', rejectApproval);

        return () => window.removeEventListener('beforeunload', rejectApproval);
    }, []);

    return [getApproval, resolveApproval, rejectApproval] as const;
};