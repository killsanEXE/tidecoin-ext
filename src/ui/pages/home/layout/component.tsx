import Nav from "@/ui/components/nav";
import s from "./styles.module.scss";
import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";
import { useWalletState } from "@/ui/states/walletState";


const Layout = () => {

  const { wallets } = useWalletState((v) => ({
    wallets: v.wallets
  }))

  return (
    <div className={s.layout}>
      {wallets.size > 0 ? <Outlet /> : <Navigate to="/pages/create-new-wallet" />}
      <Nav />
    </div>
  );
}

export default Layout