import type { FC } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { AppBar, Box, Button, Divider, Toolbar } from "@mui/material";
import Logo from "src/components/Logo";

interface MainNavbarProps {
  onSidebarMobileOpen?: () => void;
}

const MainNavbar: FC<MainNavbarProps> = (props) => {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        color: "text.secondary",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Link href="/">
          <a>
            <Logo
              sx={{
                height: 40,
                width: 40,
              }}
            />
          </a>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Box
          sx={{
            alignItems: "center",
            display: {
              md: "flex",
              xs: "none",
            },
          }}
        >
          <Divider
            orientation="vertical"
            sx={{
              height: 32,
              mx: 2,
            }}
          />
          <Button
            color="primary"
            component="a"
            href="/"
            size="small"
            variant="contained"
          >
            Home
          </Button>
        </Box>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

MainNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default MainNavbar;
