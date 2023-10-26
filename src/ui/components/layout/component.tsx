import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import s from "./styles.module.scss";
import cn from "classnames";
import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { useWalletState } from "@/ui/states/walletState";
import { useControllersState } from "@/ui/states/controllerState";

interface IRouteTitle {
  route: string;
  title: string;
  action?: {
    icon: React.ReactNode;
    link: string;
  };
  backAction?: () => void;
  disableBack?: boolean;
}

export default function PagesLayout() {
  const { stateController } = useControllersState((v) => ({
    stateController: v.stateController,
  }));

  const currentRoute = useLocation();
  const navigate = useNavigate();
  const { wallets } = useWalletState((v) => ({ wallets: v.wallets }));

  const routeTitles = useMemo(
    () =>
      [
        ...defaultTitles,
        {
          route: "/pages/create-new-wallet",
          title: "Create New Wallet",
          disableBack: wallets.length <= 0,
        },
        {
          route: "/pages/new-mnemonic",
          title: "Create New Wallet",
          backAction: async () => {
            if (await stateController.getPendingWallet()) {
              await stateController.clearPendingWallet();
            }
            navigate(-1);
          },
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
      ] as IRouteTitle[],
    [navigate, stateController, currentRoute.state, wallets.length]
  );

  const currentRouteTitle = useMemo(
    () =>
      routeTitles.find((i) => {
        if (i.route.includes("@")) {
          return currentRoute.pathname.includes(i.route.slice(0, i.route.length - 1));
        }
        return currentRoute.pathname === i.route;
      }),
    [currentRoute, routeTitles]
  );

  return (
    <div className={s.layout}>
      {
        <div className={s.header}>
          {!currentRouteTitle?.disableBack && (
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

const defaultTitles: IRouteTitle[] = [
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
    route: "/pages/settings",
    title: "Settings",
  },
  {
    route: "/pages/show-mnemonic/@",
    title: "Recovering mnemonic",
  },
  {
    route: "/pages/show-pk/@",
    title: "Recovering private key",
  },
];
