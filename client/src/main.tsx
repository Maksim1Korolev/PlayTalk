import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { StoreProvider, SocketProvider, UserProvider } from "./app/providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StoreProvider>
      <SocketProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </SocketProvider>
    </StoreProvider>
  </BrowserRouter>
);
