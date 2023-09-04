import Nav from "../../components/Nav";
import { useAppState } from "shared/states/appState";



export default function Layout() {

  const appState = useAppState();

  return (
    <div>
      <button onClick={() => {appState.createNewAccount()}}>CreateAccount</button>
      <Nav />
    </div>
  );
}