import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { Code, Videocam, Gesture, Chat, People } from "@mui/icons-material";
import Editor from "../components/Editor";
import { styled, useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { Menu, ChevronLeft, ChevronRight } from "@mui/icons-material";
import CodeComponent from "./Code";
import Whiteboard from "./Whiteboard";
import Whiteboardsocket from "./Whiteboardsocket";
import Meet from "./Meet";
import RoomDrawerLayout from "./DrawerLayout";

function TabPanel(props) {
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
}

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
  zIndex: theme.zIndex.toolbar + 1,
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

const drawerWidth = 360;

const useClient = createClient({
  mode: "rtc",
  codec: "vp8",
});

export default function RoomWorkArea() {
  const theme = useTheme();
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

  const [tabValue, setTabValue] = useState(0);

  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatDrawerTab, setChatDrawerTab] = React.useState(1);

  const appId = process.env.REACT_APP_AGORA_ID;
  const {
    rtcToken,
    uid,
    roomId: channelName,
  } = useSelector((state) => state.RTC);
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [trackState, setTrackState] = useState({ video: false, audio: false });
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      client.on("user-joined", (user) => {
        console.log("joined", user);
        const [uid, username] = user.uid.split("~~");
        const audio = !user._audio_muted_;
        const video = !user._video_muted_;
      });

      await client.join(appId, name, rtcToken, uid);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
      (async () => {
        await tracks[0].setEnabled(false);
        await tracks[1].setEnabled(false);
      })();
    };

    if (ready && tracks) {
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  const handleChatClickToggle = () => {
    setChatDrawerTab(0);
    setChatDrawerOpen((prev) => {
      return !prev;
    });
  };

  const handlePeopleClickToggle = () => {
    setChatDrawerTab(1);
    setChatDrawerOpen((prev) => {
      return !prev;
    });
  };

  const handleChatDrawerTabChange = (event, newValue) => {
    setChatDrawerTab(newValue);
  };

  return (
    <Paper>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" open={false}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Code
            </Typography>
          </Toolbar>
        </AppBar>
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
          </List>
        </MiniDrawer>
        <Main open={chatDrawerOpen} sx={{ flexGrow: 1 }}>
          <TabPanel value={tabValue} index={0}>
            <CodeComponent />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Whiteboard />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Meet
              useClient={useClient}
              useMicrophoneAndCameraTracks={useMicrophoneAndCameraTracks}
              start={start}
              tracks={tracks}
              client={client}
              users={users}
              setStart={setStart}
              trackState={trackState}
              setTrackState={setTrackState}
            />
          </TabPanel>
        </Main>
        <Drawer
          style={{ visibility: chatDrawerOpen ? "visible" : "hidden" }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={chatDrawerOpen}
        >
          <ChatDrawerHeader>
            <IconButton onClick={() => setChatDrawerOpen(false)}>
              {theme.direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
            <Tabs
              value={chatDrawerTab}
              onChange={handleChatDrawerTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Chat" />
              <Tab label="Users" />
            </Tabs>
          </ChatDrawerHeader>
          <Divider />
          <RoomDrawerLayout value={chatDrawerTab} />
        </Drawer>
      </Box>
    </Paper>
  );
}
