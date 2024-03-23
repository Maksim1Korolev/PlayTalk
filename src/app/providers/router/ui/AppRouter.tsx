import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../../../../pages/AuthPage/ui/AuthPage";
import { OnlinePage } from "../../../../pages/OnlinePage";
import { RequireAuth } from "./RequireAuth";

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <OnlinePage />
          </RequireAuth>
        }
      />

      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
};

export default memo(AppRouter);
