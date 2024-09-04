import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { StoreProvider } from "./app/providers/store/StoreProvider";
import UsersProvider from "./app/providers/UsersProvider/ui/UsersProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StoreProvider>
      <UsersProvider>
        <App />
      </UsersProvider>
    </StoreProvider>
  </BrowserRouter>
);
