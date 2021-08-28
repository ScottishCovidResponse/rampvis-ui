/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRef, useState } from "react";
import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from "@material-ui/core";
import useAuth from "../../hooks/useAuth";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";

import ShowHideGuard from "../ShowHideGuard";

const AccountPopover: FC = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose();
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Unable to logout.");
    }
  };

  const handleLoginClick = () => {
    navigate("/auth/login");
  };


  return (
    <>
      <Box
        component={ButtonBase}
        onClick={handleOpen}
        ref={anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <Avatar
          // src={user?.avatar}
          sx={{
            height: 32,
            width: 32,
          }}
        />
      </Box>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 240 },
        }}
      >
        <ShowHideGuard>
          <Box sx={{ p: 2 }}>
            <Typography color="textPrimary" variant="subtitle2">
              {user?.name}
            </Typography>
            <Typography color="textSecondary" variant="subtitle2">
              {user?.email}
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ mt: 2 }}>
            {/* 
            <MenuItem component={Link} to="/user/profile">
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography color="textPrimary" variant="subtitle2">
                    Profile
                  </Typography>
                }
              />
            </MenuItem> */}
            {/* <MenuItem component={Link} to="/user/settings">
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography color="textPrimary" variant="subtitle2">
                    Settings
                  </Typography>
                }
              />
            </MenuItem> 
            */}
          </Box>

          <Box sx={{ p: 2 }}>
            <Button
              color="primary"
              fullWidth
              onClick={handleLogout}
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </ShowHideGuard>
        {!user ? (
          <Box sx={{ p: 2 }}>
            <Button
              color="primary"
              fullWidth
              onClick={handleLoginClick}
              variant="outlined"
            >
              Login
            </Button>
          </Box>
        ) : (
          <></>
        )}
      </Popover>
    </>
  );
};

export default AccountPopover;
