import { createHashRouter, Navigate } from "react-router-dom";

import Layout from "@/ui/pages/home/layout";
import Wallet from "@/ui/pages/home/wallet";

import Login from "@/ui/pages/account/login";
import CreatePassword from "@/ui/pages/account/create-password";
import CreateNewAccount from "@/ui/components/pages/new-account";
import SwitchAccount from "@/ui/components/pages/switch-account";
import PagesLayout from "@/ui/components/pages";
import ChangePassword from "../components/pages/change-password";
import Receive from "../components/pages/receive";
import SwitchWallet from "../components/pages/switch-wallet";
import NewWallet from "../components/pages/new-wallet";
import NewMnemonic from "../components/pages/new-wallet/new-mnemonic";
import RestoreMnemonic from "../components/pages/new-wallet/restore-mnemonic";
import RestorePrivKey from "../components/pages/new-wallet/restore-priv-key";
import Settings from "./home/settings";
import ShowPk from "../components/pages/switch-account/show-pk";

export const guestRouter = createHashRouter([
  {
    path: "account",
    children: [
      { path: "login", element: <Login /> },
      { path: "create-password", element: <CreatePassword /> },
    ],
  },
  { path: "*", element: <Navigate to={"/account/login"} /> },
]);

export const authenticatedRouter = createHashRouter([
  {
    path: "home",
    element: <Layout />,
    children: [
      { path: "wallet", element: <Wallet /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "pages",
    element: <PagesLayout />,
    children: [
      { path: "switch-account", element: <SwitchAccount /> },
      { path: "create-new-account", element: <CreateNewAccount /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "receive", element: <Receive /> },
      { path: "switch-wallet", element: <SwitchWallet /> },
      { path: "create-new-wallet", element: <NewWallet /> },
      { path: "new-mnemonic", element: <NewMnemonic /> },
      { path: "restore-mnemonic", element: <RestoreMnemonic /> },
      { path: "restore-priv-key", element: <RestorePrivKey /> },
      { path: "show-pk/:accId", element: <ShowPk /> },
    ]
  },
  { path: "*", element: <Navigate to={"/home/wallet"} /> },
]);
