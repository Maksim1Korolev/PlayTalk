import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../../../../pages/AuthPage/ui/AuthPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
    </Routes>
  );
};

export default memo(AppRouter);
