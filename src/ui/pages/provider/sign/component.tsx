import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss";
import { useEffect, useState } from "react";

import { KeyIcon } from "@heroicons/react/24/solid";

const Sign = () => {
  const [origin, setOrigin] = useState<string>("https://heroicons.com/");
  const [message, setMessage] = useState<string>();

  const { notificationController } = useControllersState((v) => ({
    notificationController: v.notificationController,
  }));

  useEffect(() => {
    document.title = "Signing message";
    (async () => {
      const approval = await notificationController.getApproval();
      setMessage(approval.params.data.text);
    })();
  }, []);

  return (
    <div className={s.container}>
      <div className="flex justify-center w-full mt-4">
        <div className="px-5 py-2 rounded-xl bg-input-bg text-gray-300">{origin}</div>
      </div>
      <div className={s.content}>
        <KeyIcon className="w-10 h-10 text-yellow-500" />
        <h4 className="text-xl font-medium">Sign request</h4>
        <div className="text-sm text-gray-400">You are signing</div>
        <div className="p-2 bg-input-bg rounded-xl max-h-full">
          <div className="break-all max-h-60 overflow-y-auto px-1">{"fDSJf89SYDFs8df7gs".repeat(70)}</div>
        </div>
      </div>
      <div className={s.btnContainer}>
        <button
          className="bg-text text-bg hover:bg-yellow-500 hover:text-bg"
          onClick={() => {
            notificationController.resolveApproval();
          }}
        >
          Sign
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

export default Sign;
