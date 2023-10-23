import { createHashRouter, Navigate } from "react-router-dom";

import Wallet from "@/ui/pages/home/wallet";

import Login from "@/ui/pages/account/login";
import CreatePassword from "@/ui/pages/account/create-password";
import CreateNewAccount from "@/ui/pages/account/new-account";
import SwitchAccount from "@/ui/pages/account/switch-account";
import PagesLayout from "@/ui/components/layout";
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
import ChangeAddrType from "@/ui/pages/account/change-addr-type";
import TransactionInfo from "./account/transaction-info";
import RenameAccount from "@/ui/pages/account/switch-account/rename-account";
import RenameWallet from "./account/switch-wallet/rename-wallet";
import FinalleSend from "./account/send/finalle-send";
import CreateSend from "./account/send/create-send";
import ConfirmSend from "./account/send/confirm-send";
import Connect from "./provider/connect";
import Sign from "./provider/sign";
import SignTx from "./provider/sign-tx";
import CreateTx from "./provider/create-tx/component";

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
  { path: "home", element: <Wallet /> },
  {
    path: "pages",
    element: <PagesLayout />,
    children: [
      { path: "settings", element: <Settings /> },
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
      { path: "change-addr-type", element: <ChangeAddrType /> },
      { path: "transaction-info/:txId", element: <TransactionInfo /> },
      { path: "rename-account/:accId", element: <RenameAccount /> },
      { path: "rename-wallet/:walletId", element: <RenameWallet /> },
      { path: "finalle-send/:txId", element: <FinalleSend /> },
      { path: "create-send", element: <CreateSend /> },
      { path: "confirm-send", element: <ConfirmSend /> },
    ],
  },
  {
    path: "provider",
    children: [
      { path: "connect", element: <Connect /> },
      { path: "signMessage", element: <Sign /> },
      { path: "signTx", element: <SignTx /> },
      { path: "createTx", element: <CreateTx /> },
    ],
  },
  { path: "*", element: <Navigate to={"/home"} /> },
]);
