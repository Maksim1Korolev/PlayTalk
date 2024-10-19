import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./app/App";
import { SocketProvider, StoreProvider } from "./app/providers";
import { ModalProvider } from "./app/providers/ModalProvider";
import { store } from "./app/providers/StoreProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <StoreProvider>
        <SocketProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </SocketProvider>
      </StoreProvider>
    </Provider>
  </BrowserRouter>
);
