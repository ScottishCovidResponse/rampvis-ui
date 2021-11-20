import type { FC, ReactNode } from "react";
import { useState } from "react";
// import { Navigate, useLocation } from 'react-router-dom';
import { useRouter } from "next/router";
import useAuth from "src/hooks/useAuth";
import Login from "src/pages/auth/login";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  // const location = useLocation();
  const router = useRouter();
  const [requestedLocation, setRequestedLocation] = useState<string>(
    null as any,
  );

  console.log(
    "AuthGuard: requestedLocation =",
    requestedLocation,
    "router.asPath =",
    router.asPath,
  );
  if (!auth.isAuthenticated) {
    if (router.asPath !== requestedLocation) {
      setRequestedLocation(router.asPath);
    }

    return <Login />;
  }

  // This is done so that in case the route changes by any chance through other
  // means between the moment of request and the render we navigate to the initially
  // requested route.
  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null as any);
    return <>{router.push(requestedLocation)}</>;
  }

  return <>{children}</>;
};

export default AuthGuard;
