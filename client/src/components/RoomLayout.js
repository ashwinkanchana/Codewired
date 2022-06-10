import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  Tabs,
  Divider,
  IconButton,
  Tab,
  AppBar,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import RoomWorkArea from "./RoomWorkArea";
import {
  ADD_NEW_MESSAGE,
  ADD_USER,
  CODE_REMOVE_CLIENT,
  CODE_SET_CLIENTS,
  COMPOSE_MESSAGE,
  REMOVE_USER,
  START_RTC,
  UPDATE_CODE,
  UPDATE_ROOM_USERS,
} from "../store/actions/types";
import { initSocket } from "../utils/socketio-client";
import { TabPanel } from "./RoomComponents";
import { ToastContainer, toast } from "react-toastify";
import ACTIONS from "../utils/actions";
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
  const [tabValue, setTabValue] = useState(0);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatDrawerTab, setChatDrawerTab] = React.useState(1);
  const socketRef = useRef(null);
  const {
    appId,
    username,
    rtcToken,
    uid,
    roomId: channelName,
  } = useSelector((state) => state.RTC);
  const { message } = useSelector((state) => state.CHAT);
  const IDE = useSelector((state) => state.IDE);
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

  function handleErrors(e) {
    console.log("socket error", e);
    toast.error("Socket connection failed, try again later.");
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.on("message", (message) => {
        dispatch({
          type: ADD_NEW_MESSAGE,
          payload: message,
        });
        console.log("new message", message);
      });

      socketRef.current.on("roomMembers", (usersList) => {
        dispatch({
          type: UPDATE_ROOM_USERS,
          payload: usersList,
        });
        console.log("roomMembers", usersList);
      });

      socketRef.current.emit(
        "join",
        { user: username, room: channelName },
        (err) => {
          if (err) {
            console.log("err", err);
          }
        }
      );
      // message send to server, event emit
      socketRef.current.emit(ACTIONS.JOIN, {
        // join event
        roomId: channelName, // useParams - link param
        username: uid,
      });

      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          //editorRef.current.setValue(code);
          dispatch({ type: UPDATE_CODE, payload: code });
        }
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          dispatch({
            type: CODE_SET_CLIENTS,
            payload: clients,
          });

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            // emit code change (sync)

            //#######################################
            //code: codeRef.current,
            //#######################################
            code: IDE.code,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        dispatch({
          type: CODE_REMOVE_CLIENT,
          payload: socketId,
        });
      });
    };

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message.length !== 0)
      socketRef.current.emit("sendMessage", message, () => {
        dispatch({
          type: COMPOSE_MESSAGE,
          payload: "",
        });
      });
  };

  return (
    <Box sx={{ display: "flex", background: "#1e1e1e" }}>
      <Main open={open}>
        <DrawerHeader />
        <RoomWorkArea
          socketRef={socketRef}
          tracks={tracks}
          tabValue={tabValue}
          setTabValue={setTabValue}
          chatDrawerOpen={chatDrawerOpen}
          setChatDrawerOpen={setChatDrawerOpen}
          chatDrawerTab={chatDrawerTab}
          setChatDrawerTab={setChatDrawerTab}
          sendMessage={sendMessage}
        />
      </Main>

      <Drawer
        style={{ visibility: open ? "visible" : "hidden" }}
        sx={{
          pt: 2,
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
      </Drawer>

      <ToastContainer theme="dark" />
    </Box>
  );
}
