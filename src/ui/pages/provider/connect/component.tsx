import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { FingerPrintIcon } from "@heroicons/react/24/solid";

const Connect = () => {
  const [origin, setOrigin] = useState<string>("https://heroicons.com/");

  const { notificationController } = useControllersState((v) => ({
    notificationController: v.notificationController,
  }));

  useEffect(() => {
    document.title = "Signing message";
    (async () => {
      const approval = await notificationController.getApproval();
      setOrigin(approval.origin);
    })();
  }, []);

  if (!origin) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ReactLoading type="cylon" color="#fff" />
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className="flex justify-center w-full mt-4">
        <div className="px-5 py-2 rounded-xl bg-input-bg text-gray-300">{origin}</div>
      </div>
      <div className={s.content}>
        <FingerPrintIcon className="w-40 h-40 text-green-400 bg-input-bg rounded-full p-4" />
        <h3 className="text-xl font-medium">Access required</h3>
      </div>
      <div className={s.btnContainer}>
        <button
          className="bg-text text-bg hover:bg-green-500 hover:text-text"
          onClick={() => {
            notificationController.resolveApproval();
          }}
        >
          Approve
        </button>
        <button
          className="bg-bg border border-text hover:bg-red-500 hover:border-red-500"
          onClick={() => {
            notificationController.rejectApproval();
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default Connect;
