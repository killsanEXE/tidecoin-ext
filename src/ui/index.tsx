import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { setupWalletProxy } from "./utils/setup";
import { createContext } from "vm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <App />
);
