import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss"

const Connect = () => {

    const { notificationController } = useControllersState((v) => ({
        notificationController: v.notificationController
    }))

    return (
        <div className={s.connect}>
            <button onClick={() => {
                notificationController.resolveApproval();
            }}>Connect</button>
        </div>
    )
}

export default Connect;