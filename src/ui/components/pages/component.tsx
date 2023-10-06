import { Outlet, useLocation, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import cn from "classnames";
import ArrowLeft from "@/ui/components/icons/ArrowLeft.svg";
import PlusInCircleIcon from "@/ui/components/icons/PlusInCirlceIcon.svg";
import { useWalletState } from "@/ui/states/walletState";

export default function PagesLayout() {
  const routeTitles = [
    {
      route: "/pages/switch-account",
      title: "Switch Account",
      action: () => {
        navigate("/pages/create-new-account");
      },
    },
    {
      route: "/pages/create-new-account",
      title: "Create New Account",
    },
    {
      route: "/pages/change-password",
      title: "Change Password",
    },
    {
      route: "/pages/receive",
      title: "Receive TDC",
    },
    {
      route: "/pages/switch-wallet",
      title: "Switch Wallet",
      action: () => {
        navigate("/pages/create-new-wallet");
      },
    },
    {
      route: "/pages/create-new-wallet",
      title: "Create New Wallet",
    },
    {
      route: "/pages/new-mnemonic",
      title: "Create New Wallet",
    },
    {
      route: "/pages/restore-mnemonic",
      title: "Create New Wallet",
    },
    {
      route: "/pages/restore-priv-key",
      title: "Create New Wallet",
    },
    {
      route: "/pages/send",
      title: "Send",
    },
  ];

  const { wallets } = useWalletState((v) => ({ wallets: v.wallets }));
  const currentRoute = useLocation();
  const navigate = useNavigate();

  return (
    <div className={s.layout}>
      {routeTitles.find((f) => f.route === currentRoute.pathname) ? (
        <div className={s.controlDiv}>
          {wallets.length <= 0 &&
          currentRoute.pathname === "/pages/create-new-wallet" ? (
            <p></p>
          ) : (
            <p
              className={cn(s.controlElem, s.back)}
              onClick={() => {
                navigate(-1);
              }}
            >
              <ArrowLeft /> Back
            </p>
          )}
          <p className={s.controlElem}>
            {
              routeTitles.find((f) => f.route === currentRoute.pathname)![
                "title"
              ]
            }
          </p>
          {routeTitles.find((f) => f.route === currentRoute.pathname)![
            "action"
          ] === undefined ? (
            <p className="w-[20%]"></p>
          ) : (
            <p
              className={cn(s.controlElem, s.addNew)}
              onClick={
                routeTitles.find((f) => f.route === currentRoute.pathname)![
                  "action"
                ]
              }
            >
              <PlusInCircleIcon />
            </p>
          )}
        </div>
      ) : (
        <div className={s.controlDiv}>
          <p
            className={cn(s.controlElem, s.back)}
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft /> Back
          </p>
          <p className={s.controlElem}>
            {currentRoute.pathname.includes("/show") ? "Private" : ""}
          </p>
          <p className="w-[20%]"></p>
        </div>
      )}
      <div className={s.contentDiv}>
        <Outlet />
      </div>
    </div>
  );
}
