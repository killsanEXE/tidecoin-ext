import { createHashRouter, Navigate } from "react-router-dom";

import Layout from "@/ui/pages/home/layout";
import Wallet from "@/ui/pages/home/wallet";

import Login from "@/ui/pages/account/login";
import CreatePassword from "@/ui/pages/account/create-password";
import CreateNewAccount from "@/ui/pages/account/new-account";
import SwitchAccount from "@/ui/pages/account/switch-account";
import PagesLayout from "@/ui/components/pages";
import ChangePassword from "./account/change-password";
import Receive from "./account/receive";
import SwitchWallet from "./account/switch-wallet";
import NewWallet from "./account/new-wallet";
import NewMnemonic from "./account/new-wallet/new-mnemonic";
import RestoreMnemonic from "./account/new-wallet/restore-mnemonic";
import RestorePrivKey from "./account/new-wallet/restore-priv-key";
import Settings from "./home/settings";
import ShowPk from "@/ui/pages/account/switch-account/show-pk";
import ShowMnemonic from "./account/switch-wallet/show-mnemonic";
import Send from "../components/pages/send";
import ChangeAddrType from "@/ui/pages/account/change-addr-type";
import TransactionInfo from "./account/transaction-info";
import RenameAccount from "@/ui/pages/account/switch-account/rename-account";
import RenameWallet from "./account/switch-wallet/rename-wallet";

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
      { path: "show-mnemonic/:walletId", element: <ShowMnemonic /> },
      { path: "send", element: <Send /> },
      { path: "change-addr-type", element: <ChangeAddrType /> },
      { path: "transaction-info/:txId", element: <TransactionInfo /> },
      { path: "rename-account/:accId", element: <RenameAccount /> },
      { path: "rename-wallet/:walletId", element: <RenameWallet /> },
    ],
  },
  { path: "*", element: <Navigate to={"/home/wallet"} /> },
]);
