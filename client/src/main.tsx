import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { StoreProvider, SocketProvider, UserProvider } from "./app/providers";
import { ModalProvider } from "./app/providers/ModalProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StoreProvider>
      <SocketProvider>
        <UserProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </UserProvider>
      </SocketProvider>
    </StoreProvider>
  </BrowserRouter>
);
