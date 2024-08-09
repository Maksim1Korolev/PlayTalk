import { Navbar } from "@/widgets/Navbar";
import { Suspense } from "react";
import AppRouter from "./providers/router/ui/AppRouter";
import "./styles/index.scss";

function App() {
  return (
    <div id="app" className="app">
      <Suspense fallback="">
        <Navbar />
        <AppRouter />
      </Suspense>
    </div>
  );
}

export default App;
