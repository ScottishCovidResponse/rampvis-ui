import { useEffect } from "react";
import type { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, Drawer, Typography } from "@material-ui/core";
import type { Theme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DashboardIcon from "@material-ui/icons/Dashboard";
import TimelineIcon from "@material-ui/icons/Timeline";
import BookmarksIcon from "@material-ui/icons/Bookmarks";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import PlaceIcon from "@material-ui/icons/Place";
import AssessmentIcon from "@material-ui/icons/Assessment";
import DonutSmallIcon from "@material-ui/icons/DonutSmall";
import SearchIcon from "@material-ui/icons/Search";
import AllInboxIcon from "@material-ui/icons/AllInbox";
import Filter1Icon from "@material-ui/icons/Filter1";
import useAuth from "src/hooks/useAuth";
import Logo from "src/components/Logo";
import NavSection from "src/components/dashboard-layout/NavSection";
import Scrollbar from "src/components/Scrollbar";

interface DashboardSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const sections = [
  {
    items: [
      {
        title: "My Portal",
        path: "/portal",
        icon: <BookmarksIcon fontSize="small" />,
      },
      {
        title: "Search",
        path: "/search",
        icon: <SearchIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Dashboards",
        path: "/dashboard",
        icon: <DashboardIcon fontSize="small" />,
      },
      {
        title: "Plots",
        path: "/plot",
        icon: <DonutSmallIcon fontSize="small" />,
      },
      {
        title: "Analytics",
        path: "/analytics",
        icon: <TimelineIcon fontSize="small" />,
      },
      {
        title: "Models",
        path: "/model",
        icon: <AssessmentIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Scotland",
        path: "/country/scotland",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        title: "England",
        path: "/country/england",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        title: "N. ireland",
        path: "/country/northern-ireland",
        icon: <PlaceIcon fontSize="small" />,
      },
      {
        title: "Wales",
        path: "/country/wales",
        icon: <PlaceIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Tools",
        path: "",
        icon: <AllInboxIcon fontSize="small" />,
        children: [
          {
            title: "Timeseries Similarity",
            path: "/tools/timeseries-sim",
            icon: <Filter1Icon fontSize="small" />,
          },
        ],
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Development",
        path: "/development/release",
        icon: <ArrowForwardIosIcon fontSize="small" />,
        children: [
          {
            title: "Example",
            path: "/development/example",
            icon: <ArrowForwardIosIcon fontSize="small" />,
          },
          {
            title: "Review",
            path: "/development/review",
            icon: <ArrowForwardIosIcon fontSize="small" />,
          },
          {
            title: "Released",
            path: "/development/release",
            icon: <ArrowForwardIosIcon fontSize="small" />,
          },
        ],
      },
    ],
  },
];

const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  const router = useRouter();

  const { user } = useAuth();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [router.asPath]);

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
  
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              alignItems: "center",
              backgroundColor: "background.default",
              borderRadius: 1,
              display: "flex",
              overflow: "hidden",
              p: 2,
            }}
          >
 
            <Logo
              sx={{
                height: 60,
                width: 60,
              }}
            />

            <Box sx={{ ml: 2 }}>
              <Typography color="primary" variant="h5">
                RAMPVIS
              </Typography>
              <Typography color="primary" alignItems="center" variant="body2">
                v.0.9
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={router.asPath}
              sx={{
                "& + &": {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "background.paper",
            // height: "calc(100% - 64px) !important",
            // top: "64px !Important",
            height: "calc(100% - 0) !important",
            top: "0px !Important",
             width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          width: 280,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DashboardSidebar;
