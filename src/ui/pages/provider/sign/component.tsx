import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss"

const Sign = () => {
    const { notificationController } = useControllersState((v) => ({
        notificationController: v.notificationController
    }))

    return (
        <div className={s.sign}>
            <button onClick={() => {
                notificationController.resolveApproval();
            }}>SIGN</button>
        </div>
    )
}

export default Sign;