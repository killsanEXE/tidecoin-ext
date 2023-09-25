import Nav from "@/ui/components/nav";
import s from "./styles.module.scss";
import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "@/ui/states/appState";


const Layout = () => {

  const { isUnlocked } = useAppState((v) => ({ isUnlocked: v.isUnlocked }))

  return (
    <div className={s.layout}>
      {isUnlocked ? <Outlet /> : <Navigate to="/account/login" />}
      <Nav />
    </div>
  );
}

export default Layout