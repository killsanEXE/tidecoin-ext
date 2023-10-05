import Nav from "@/ui/components/nav";
import s from "./styles.module.scss";
import { Navigate, Outlet } from "react-router-dom";
import { useWalletState } from "@/ui/states/walletState";


const Layout = () => {

  const { wallets, vaultIsEmpty } = useWalletState((v) => ({
    wallets: v.wallets,
    vaultIsEmpty: v.vaultIsEmpty
  }))

  return (
    <div className={s.layout}>
      {(wallets.length > 0 || !vaultIsEmpty) ? <Outlet /> : <Navigate to="/pages/create-new-wallet" />}
      <Nav />
    </div>
  );
}

export default Layout