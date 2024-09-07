import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { StoreProvider, SocketProvider, UsersProvider } from "./app/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StoreProvider>
      <SocketProvider>
        <UsersProvider>
          <App />
        </UsersProvider>
      </SocketProvider>
    </StoreProvider>
  </BrowserRouter>
);
