import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../../../../pages/AuthPage";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/"  element={<AuthPage/>}/>
    </Routes>
  );
};

export default memo(AppRouter);