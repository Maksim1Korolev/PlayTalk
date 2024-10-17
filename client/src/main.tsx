import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { StoreProvider, SocketProvider, UserProvider } from "./app/providers";
import { ModalProvider } from "./app/providers/ModalProvider";
import { Provider } from "react-redux";
import { store } from "./app/providers/StoreProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      //TODO:Remove?
      <StoreProvider>
        <SocketProvider>
          <UserProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </UserProvider>
        </SocketProvider>
      </StoreProvider>
    </Provider>
  </BrowserRouter>
);
