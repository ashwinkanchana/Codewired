import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Drawer, Tabs, Divider, IconButton, Tab } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import RoomDrawerLayout from "./DrawerLayout";
import RoomWorkArea from "./RoomWorkArea";
import { ADD_USER, REMOVE_USER, START_RTC } from "../store/actions/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 320;

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function RoomLayout({
  useClient,
  useMicrophoneAndCameraTracks,
}) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(1);

  const {
    appId,
    start,
    users,
    rtcToken,
    uid,
    roomId: channelName,
  } = useSelector((state) => state.RTC);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          dispatch({ type: ADD_USER, payload: user });
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
          dispatch({ type: REMOVE_USER, payload: user.uid });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        dispatch({ type: REMOVE_USER, payload: user.uid });
      });

      await client.join(appId, name, rtcToken, uid);
      if (tracks) {
        await client.publish([tracks[0], tracks[1]]);
        dispatch({
          type: START_RTC,
        });
        await tracks[0].setEnabled(false);
        await tracks[1].setEnabled(false);
      }
    };

    if (ready && tracks) {
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Main open={open}>
        <DrawerHeader />
        <RoomWorkArea tracks={tracks} />
      </Main>
      <Drawer
        style={{ visibility: open ? "visible" : "hidden" }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
          <Tabs value={value} onChange={handleChange} aria-label="drawer tabs">
            <Tab label="Chat" />
            <Tab label="Users" />
          </Tabs>
        </DrawerHeader>
        <Divider />
        <RoomDrawerLayout value={value} />
      </Drawer>
      <ToastContainer />
    </Box>
  );
}
