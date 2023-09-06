import Nav from "../../components/Nav";
import { useAppState } from "shared/states/appState";
import "./Layout.scss";



export default function Layout() {

  const appState = useAppState();

  return (
    <div className="layout">

      <Nav />
    </div>
  );
}