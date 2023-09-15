import { useEffect } from "react";
import Nav from "../../components/Nav";
import "./Layout.scss";
import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "/ui/shared/states/appState";



export default function Layout() {

  const { isUnlocked } = useAppState((v) => ({ isUnlocked: v.isUnlocked }))

  return (
    <div className="layout">
      {isUnlocked ? <Outlet /> : <Navigate to="/account/login" />}
      <Nav />
    </div>
  );
}