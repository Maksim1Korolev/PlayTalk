import "./styles/index.scss";
import { Suspense } from "react";
import { AppRouter } from "./providers/";
import { Navbar } from "@/widgets/Navbar";

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
