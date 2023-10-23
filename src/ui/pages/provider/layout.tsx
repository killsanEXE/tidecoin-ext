import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { FingerPrintIcon, KeyIcon } from "@heroicons/react/24/solid";
import { useLocation } from "react-router-dom";
import { ApprovalData } from "@/shared/interfaces/notification";

interface RouteOptions {
  path: string;
  documentTitle: string;
  resolveBtnText?: string;
  resolveBtnClassName: string;
  content: React.ReactNode | ((...args: any[]) => React.ReactNode);
  getArgs?: (approval: ApprovalData) => Promise<any[]>;
}

const routeProps: RouteOptions[] = [
  {
    path: "/provider/connect",
    content: (
      <>
        <FingerPrintIcon className="w-40 h-40 text-green-400 bg-input-bg rounded-full p-4" />
        <h3 className="text-xl font-medium">Access required</h3>
      </>
    ),
    documentTitle: "Connect to tidecoin",
    resolveBtnClassName: "bg-text text-bg hover:bg-green-500 hover:text-text",
  },
  {
    path: "/provider/sign",
    content: (message: string) => (
      <>
        <KeyIcon className="w-10 h-10 text-yellow-500" />
        <h4 className="text-xl font-medium">Sign request</h4>
        <div className="text-sm text-gray-400">You are signing</div>
        <div className="p-2 bg-input-bg rounded-xl max-h-full">
          <div className="break-all max-h-60 overflow-y-auto px-1">{message}</div>
        </div>
      </>
    ),
    documentTitle: "Sign transaction",
    resolveBtnClassName: "bg-text text-bg hover:bg-yellow-500 hover:text-bg",
    getArgs: async (approval) => {
      return [approval.params.data.text];
    },
    resolveBtnText: "Sign",
  },
];

interface Props {
  documentTitle: string;
  content: React.ReactNode;
}

const Layout: FC<Props> = ({ content, documentTitle }) => {
  const [origin, setOrigin] = useState<string>();

  const { notificationController } = useControllersState((v) => ({
    notificationController: v.notificationController,
  }));

  useEffect(() => {
    document.title = documentTitle;
    (async () => {
      const approval = await notificationController.getApproval();
      setOrigin(approval.params.session.origin);
    })();
  }, []);

  if (!origin) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ReactLoading type="cylon" color="#fff" />
      </div>
    );
  }

  const onResolve = () => {
    notificationController.resolveApproval();
  };

  const onReject = () => {
    notificationController.rejectApproval();
  };

  return (
    <div className={s.container}>
      <div className="flex justify-center w-full mt-4">
        <div className="px-5 py-2 rounded-xl bg-input-bg text-gray-300">{origin}</div>
      </div>
      <div className={s.content}>
        {typeof currentRoute.content === "function" ? currentRoute.content(...args) : currentRoute.content}
      </div>
      <div className={s.btnContainer}>
        <button className={currentRoute.resolveBtnClassName} onClick={onResolve}>
          {currentRoute.resolveBtnText ?? "Resolve"}
        </button>
        <button className="bg-bg border border-text hover:bg-red-500 hover:border-red-500" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default Layout;
