import { Suspense, memo } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "@/pages/AuthPage";
import { OnlinePage } from "@/pages/OnlinePage";
import { RequireAuth } from "./RequireAuth";
import { Loader } from "@/shared/ui";

const AppRouter = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Suspense fallback={<Loader />}>
                <OnlinePage />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <Suspense fallback={<Loader />}>
              <AuthPage />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
};

export default memo(AppRouter);
