import { memo, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { Loader } from "@/shared/ui";

import { AuthPage } from "@/pages/AuthPage";
import { MainPage } from "@/pages/MainPage";

import { RequireAuth } from "./RequireAuth";

const AppRouter = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Suspense fallback={<Loader />}>
                <MainPage />
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
