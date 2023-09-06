import Nav from "../../components/Nav";
import { useAppState } from "shared/states/appState";
import "./Layout.scss";
import { Navigate } from "react-router-dom";
import Wallet from "./wallet/Wallet";
import { useEffect } from "react";



export default function Layout(props: any) {

  useEffect(() => {
    console.log(props.children)
  })

  return (
    <div className="layout">
      {props.children}
      <Nav />
    </div>
  );
}