import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import { AktivitetToastManager } from "./components/Util/AktivitetToastManager";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <RecoilRoot>
    <App />
    <AktivitetToastManager />
  </RecoilRoot>
  // </React.StrictMode>
);
