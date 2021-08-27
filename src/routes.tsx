/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense, lazy } from "react";
import type { PartialRouteObject } from "react-router";
import { Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";

import GuestGuard from "./components/GuestGuard";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import LoadingScreen from "./components/LoadingScreen";
import MainLayout from "./components/MainLayout";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Authentication pages
const Login = Loadable(lazy(() => import("./pages/auth/Login")));

// Error pages
const UnderConstruction = Loadable( lazy(() => import("./pages/UnderConstruction")) ); 
const AuthorizationRequired = Loadable( lazy(() => import("./pages/AuthorizationRequired")) );
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));
const ServerError = Loadable(lazy(() => import("./pages/ServerError")));

// Templates using ontology data
const PageTemplate = Loadable(lazy(() => import("./pages/PageTemplate")));
const PageListTemplate = Loadable( lazy(() => import("./pages/PageListTemplate")) );
const PageSearch = Loadable(lazy(() => import("./pages/PageSearch")));

const routes: PartialRouteObject[] = [
  {
    path: "portal",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <UnderConstruction />,
      },
    ],
  },
  {
    path: "search",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <PageSearch />,
      },
    ],
  },
  {
    path: "page",
    element: <DashboardLayout />,
    children: [
      {
        path: "/:pageId",
        element: <PageTemplate />,
      },
    ],
  },
  {
    path: "pages",
    element: <DashboardLayout />,
    children: [
      {
        path: "/:pageType",
        element: <PageListTemplate />,
      },
      {
        path: "/:pageType/:visType",
        element: <PageListTemplate />,
      },
    ],
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/pages/example" replace />,
      },
      {
        path: "401",
        element: <AuthorizationRequired />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "500",
        element: <ServerError />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
