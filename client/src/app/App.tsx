import "./styles/index.scss";
import { Suspense, useEffect } from "react";
import { AppRouter } from "./providers/";
import { Navbar } from "@/widgets/Navbar";

function App() {
  useEffect(() => {
    document.body.className = "app";
  }, []);
  return (
    <>
      <Suspense fallback="">
        <Navbar className="navbar" />
        <AppRouter className="content" />
      </Suspense>
    </>
  );
}

export default App;
