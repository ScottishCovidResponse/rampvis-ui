import type { FC, ReactNode } from "react";
import useAuth from "src/hooks/useAuth";

interface ShowHideGuardProps {
  children: ReactNode;
}

const ShowHideGuard: FC<ShowHideGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <></>;
  }

  return <>{children}</>;
};

export default ShowHideGuard;
