import { useControllersState } from "@/ui/states/controllerState";
import s from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import ReactLoading from "react-loading";

interface Props {
  documentTitle: string;
  children: React.ReactNode;
  resolveBtnText?: string;
  resolveBtnClassName: string;
}

const Layout: FC<Props> = ({ children, documentTitle, resolveBtnClassName, resolveBtnText }) => {
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
      <div className={s.content}>{children}</div>
      <div className={s.btnContainer}>
        <button className={resolveBtnClassName} onClick={onResolve}>
          {resolveBtnText ?? "Resolve"}
        </button>
        <button className="bg-bg border border-text hover:bg-red-500 hover:border-red-500" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default Layout;
