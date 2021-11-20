import { useState } from "react";
import type { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { experimentalStyled } from "@mui/material";
import Footer from "../Footer";
import MainNavbar from "./MainNavbar";

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100%",
  paddingTop: 64,
}));

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <MainLayoutRoot>
      <MainNavbar />
      {children}
      <Footer />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
