import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "./app/providers/store/StoreProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);
