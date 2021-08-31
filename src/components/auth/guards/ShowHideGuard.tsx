import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
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

ShowHideGuard.propTypes = {
  children: PropTypes.node,
};

export default ShowHideGuard;
