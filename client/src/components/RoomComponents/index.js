import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  List,
  Paper,
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Drawer,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Stack,
  Switch,
  Button,
  CircularProgress,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import {
  Code,
  Videocam,
  Gesture,
  Chat,
  People,
  Mic,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE_CAMERA, TOGGLE_MIC } from "../../store/actions/types";
import "./index.css";
import codeLogo from "../../assets/vscode.png";
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ChatDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0),
  // // necessary for content to be below app bar
  // ...theme.mixins.toolbar,
  zIndex: theme.zIndex.Toolbar + 1,
  justifyContent: "flex-start",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const MiniDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...closedMixin(theme),
  "& .MuiDrawer-paper": closedMixin(theme),
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const CenterLoadingSpinner = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={3}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

const drawerWidth = 360;

const CodeAppBar = () => {
  return (
    <AppBar position="fixed" open={false}>
      <Toolbar>
      <img
            width={32}
            style={{marginRight: '8px'}}
            class="logo-container"
            src={codeLogo}
            alt="Logo"
          />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          
          Code
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

const LeftDrawer = ({
  tracks,
  chatDrawerOpen,
  chatDrawerTab,
  setTabValue,
  setChatDrawerTab,
  setChatDrawerOpen,
}) => {
  const dispatch = useDispatch();
  const { trackState } = useSelector((state) => state.RTC);

  const handleChatClickToggle = () => {
    if (chatDrawerOpen) {
      if (chatDrawerTab === 0) setChatDrawerOpen(false);
      else setChatDrawerTab(0);
    } else {
      setChatDrawerTab(0);
      setChatDrawerOpen(true);
    }
  };

  const handlePeopleClickToggle = () => {
    if (chatDrawerOpen) {
      if (chatDrawerTab === 1) setChatDrawerOpen(false);
      else setChatDrawerTab(1);
    } else {
      setChatDrawerTab(1);
      setChatDrawerOpen(true);
    }
  };

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      dispatch({
        type: TOGGLE_MIC,
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      dispatch({
        type: TOGGLE_CAMERA,
      });
    }
  };

  return (
    <MiniDrawer variant="permanent" open={false}>
      <DrawerHeader />

      <List>
        <ListItem
          onClick={() => setTabValue(0)}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <Code />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <ListItem
          onClick={() => setTabValue(1)}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <Gesture />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => setTabValue(2)}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <Videocam />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => handleChatClickToggle()}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <Chat />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <ListItem
          onClick={() => handlePeopleClickToggle()}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: "auto",
                justifyContent: "center",
              }}
            >
              <People />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding sx={{ bottom: 0, position: "fixed" }}>
          <Stack
            direction="column"
            spacing={0}
            justifyContent="center"
            alignItems="center"
          >
            <Mic />
            <Switch
              checked={trackState.audio}
              onChange={() => mute("audio")}
              name="audio"
            />
          </Stack>
        </ListItem>
        <ListItem disablePadding sx={{ bottom: 72, position: "fixed" }}>
          <Stack
            direction="column"
            spacing={0}
            justifyContent="center"
            alignItems="center"
          >
            <Videocam />
            <Switch
              checked={trackState.video}
              onChange={() => mute("video")}
              name="video"
            />
          </Stack>
        </ListItem>
      </List>
    </MiniDrawer>
  );
};

export {
  drawerWidth,
  CenterLoadingSpinner,
  TabPanel,
  closedMixin,
  MiniDrawer,
  DrawerHeader,
  ChatDrawerHeader,
  AppBar,
  Main,
  LeftDrawer,
  CodeAppBar,
};
