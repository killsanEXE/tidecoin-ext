import Nav from "../../components/Nav";
import { Account } from "../../stores/accountStore";
import { appStore } from "../../stores/appStore";



export default function Layout() {

  const appState = appStore();

  const createAccount = () => {
    let account: Account = {
      type: "string",
      pubkey: "string",
      address: "string",
      key: "string",
    }
  }

  return (
    <div>
      <button onClick={createAccount}>CreateAccount</button>
      <Nav />
    </div>
  );
}