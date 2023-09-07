import { useEffect } from "react";
import Nav from "../../components/Nav";
import "./Layout.scss";
import { useAppState } from "shared/states/appState";
import { Navigate, Outlet } from "react-router-dom";



export default function Layout() {

  const { isUnlocked } = useAppState((v) => ({ isUnlocked: v.isUnlocked }))

  useEffect(() => {
  }, [])

  return (
    <div className="layout">
      {isUnlocked ? <Outlet /> : <Navigate to="/account/insert-password" />}
      <Nav />
    </div>
  );
}