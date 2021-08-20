import { useState } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core/styles";
import Footer from "./Footer";
import MainNavbar from "./MainNavbar";
import MainSidebar from "./MainSidebar";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100%",
  paddingTop: 64,
}));

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] =
    useState<boolean>(false);

  return (
    <MainLayoutRoot>
      <MainNavbar
        onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)}
      />
      <MainSidebar
        onMobileClose={(): void => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      {children || <Outlet />}
      <Footer />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
