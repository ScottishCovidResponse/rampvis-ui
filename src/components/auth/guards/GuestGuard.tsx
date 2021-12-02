import type { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import useAuth from "src/hooks/useAuth";

interface GuestGuardProps {
  children: ReactNode;
}

const GuestGuard: FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/pages/example");
    return <></>;
  }

  return <>{children}</>;
};

export default GuestGuard;
