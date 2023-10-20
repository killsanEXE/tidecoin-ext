import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import cn from "classnames";
import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { useWalletState } from "@/ui/states/walletState";

export default function PagesLayout() {
  const routeTitles = [
    {
      route: "/pages/switch-account",
      title: "Switch Account",
      action: {
        icon: <PlusCircleIcon className="w-8 h-8" />,
        link: "/pages/create-new-account",
      },
    },
    {
      route: "/pages/change-addr-type",
      title: "Change Address Type",
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
      action: {
        icon: <PlusCircleIcon className="w-8 h-8" />,
        link: "/pages/create-new-wallet",
      },
    },
    {
      route: "/pages/create-new-wallet",
      title: "Create New Wallet",
      disableBack: (): boolean => wallets.length <= 0,
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
    {
      route: "/pages/transaction-info/@",
      title: "Transaction info",
    },
    {
      route: "/pages/rename-account/@",
      title: "Renaming account",
    },
    {
      route: "/pages/rename-wallet/@",
      title: "Renaming wallet",
    },
    {
      backAction: () => {
        navigate("/home");
      },
      route: "/pages/finalle-send/@",
      title: "Send",
    },
    {
      route: "/pages/create-send",
      title: "Send",
      backAction: () => {
        navigate("/home");
      },
    },
    {
      backAction: () => {
        navigate("/pages/create-send", {
          state: currentRoute.state,
        });
      },
      route: "/pages/confirm-send",
      title: "Send",
    },
    {
      route: "/pages/settings",
      title: "Settings",
    },
    {
      route: "/pages/show-mnemonic/@",
      title: "Recovering mnemonic",
    },
  ];

  const currentRoute = useLocation();
  const navigate = useNavigate();
  const { wallets } = useWalletState((v) => ({ wallets: v.wallets }));

  const currentRouteTitle = useMemo(
    () =>
      routeTitles.find((i) => {
        if (i.route.includes("@")) {
          return currentRoute.pathname.includes(i.route.slice(0, i.route.length - 1));
        }
        return currentRoute.pathname === i.route;
      }),
    [currentRoute]
  );

  return (
    <div className={s.layout}>
      {
        <div className={s.controlDiv}>
          {(!currentRouteTitle?.disableBack || !currentRouteTitle.disableBack()) && (
            <div
              className={cn(s.controlElem, s.back)}
              onClick={() => {
                if (currentRouteTitle?.backAction) currentRouteTitle.backAction();
                else navigate(-1);
              }}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </div>
          )}

          <div className={cn(s.controlElem, s.title)}>{currentRouteTitle?.title}</div>

          {currentRouteTitle?.action && (
            <Link className={cn(s.controlElem, s.addNew)} to={currentRouteTitle.action.link}>
              {currentRouteTitle.action.icon}
            </Link>
          )}
        </div>
      }
      <div className={s.contentDiv}>
        <Outlet />
      </div>
    </div>
  );
}
