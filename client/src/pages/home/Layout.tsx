import { useEffect } from "react";
import Nav from "../../components/Nav";
import "./Layout.scss";
import { useAppState } from "shared/states/appState";
import { Navigate } from "react-router-dom";



export default function Layout(props: any) {

  const { isUnlocked } = useAppState((v) => ({ isUnlocked: v.isUnlocked }))

  useEffect(() => {
    console.log(props)
  }, [])

  return (
    <div className="layout">
      {isUnlocked ? props.children : <Navigate to="/account/insert-password" />}
      <Nav />
    </div>
  );
}