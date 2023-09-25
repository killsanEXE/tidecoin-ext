import { createHashRouter, Navigate } from "react-router-dom";

import Layout from "@/ui/pages/home/layout";
import Wallet from "@/ui/pages/home/wallet";
import Settings from "@/ui/pages/home/settings/settings";

import Login from "@/ui/pages/account/login";
import CreatePassword from "@/ui/pages/account/create-password";
import CreateNewAccount from "@/ui/components/pages/new-account";
import SwitchAccount from "@/ui/components/pages/switch-account";
import PagesLayout from "@/ui/components/pages";

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
    ]
  },
  { path: "*", element: <Navigate to={"/home/wallet"} /> },
]);
