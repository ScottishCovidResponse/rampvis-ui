import type { FC } from "react";
import { AppBar, Box, IconButton, Toolbar, AppBarProps } from "@mui/material";
import { experimentalStyled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material//Menu";
import AccountPopover from "./AccountPopover";

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === "light" && {
    backgroundColor: "transparent",
    boxShadow: "none",
    color: theme.palette.primary.contrastText,
  }),
  ...(theme.palette.mode === "dark" && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
  }),
}));

const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="primary"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              md: "none",
            },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        {/* 
        <Logo
          sx={{
            display: {
              lg: "inline",
              xs: "none",
            },
            height: 40,
            width: 40,
          }}
        /> 
        */}

        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />

        {/* 
        <Box sx={{ ml: 1 }}>
          <ContentSearch />
        </Box> 
        */}

        {/* 
        <Box sx={{ ml: 1 }}>
          <NotificationsPopover />
        </Box> 
        */}

        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

export default DashboardNavbar;
