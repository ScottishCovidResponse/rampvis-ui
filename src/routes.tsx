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
const AuthorizationRequired = Loadable( lazy(() => import("./pages/AuthorizationRequired")));
const NotFound = Loadable(lazy(() => import("./pages/NotFound")));
const ServerError = Loadable(lazy(() => import("./pages/ServerError")));

// Templates using ontology data
const OntologyPageTemplate =  Loadable(lazy(() => import("./pages/OntologyPageTemplate")));
const OntologyPageListTemplate =  Loadable(lazy(() => import("./pages/OntologyPageListTemplate")));

const routes: PartialRouteObject[] = [
  {
    path: "page",
    element: <DashboardLayout />,
    children: [
      {
        path: "/:pageId",
        element: <OntologyPageTemplate />,
      },
    ],
  },
  {
    path: "pages",
    element: <DashboardLayout />,
    children: [
      {
        path: "/:pageType",
        element: <OntologyPageListTemplate />,
      },
      {
        path: "/:pageType/:visType",
        element: <OntologyPageListTemplate />,
      }
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
