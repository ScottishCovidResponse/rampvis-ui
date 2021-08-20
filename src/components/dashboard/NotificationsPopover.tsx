import { useRef, useState } from "react";
import type { ElementType, FC } from "react";
import { subDays, subHours } from "date-fns";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ChatIcon from "@material-ui/icons/Chat";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: number;
}

const now = new Date();

const notifications: Notification[] = [
  {
    id: "5e8883f1b51cc1956a5a1ec0",
    createdAt: subHours(now, 2).getTime(),
    description: "Notification description",
    title: "Notification a title",
    type: "a",
  },
  {
    id: "5e8883f7ed1486d665d8be1e",
    createdAt: subDays(now, 1).getTime(),
    description: "Notification description",
    title: "Notification b title",
    type: "b",
  },
  {
    id: "5e8883f7ed1486d667j8878h",
    createdAt: subDays(now, 1).getTime(),
    description: "Notification description",
    title: "Notification c title",
    type: "c",
  },
];

const iconsMap: Record<string, ElementType> = {
  a: ShoppingCartIcon,
  b: ChatIcon,
  c: CreditCardIcon,
};

const NotificationsPopover: FC = () => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={anchorRef} onClick={handleOpen}>
          <Badge color="error" badgeContent={4}>
            <NotificationsIcon fontSize="small" />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        onClose={handleClose}
        open={open}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography color="textPrimary" variant="h6">
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography color="textPrimary" variant="subtitle2">
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List disablePadding>
              {notifications.map((notification) => {
                const Icon = iconsMap[notification.type];

                return (
                  <ListItem divider key={notification.id}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          backgroundColor: "primary.main",
                          color: "primary.contrastText",
                        }}
                      >
                        <Icon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link
                          color="textPrimary"
                          sx={{ cursor: "pointer" }}
                          underline="none"
                          variant="subtitle2"
                        >
                          {notification.title}
                        </Link>
                      }
                      secondary={notification.description}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                p: 1,
              }}
            >
              <Button color="primary" size="small" variant="text">
                Mark all as read
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
};

export default NotificationsPopover;
