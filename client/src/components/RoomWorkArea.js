import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Drawer,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Grid,
  Button,
} from "@mui/material";
import {
  drawerWidth,
  TabPanel,
  LeftDrawer,
  ChatDrawerHeader,
  Main,
  CenterLoadingSpinner,
  CodeAppBar,
} from "./RoomComponents";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CodeComponent from "./Code";
import Whiteboard from "./Whiteboard";
import Meet from "./Meet";
import Chat from "./Chat";
import Users from "./Users";

const RoomWorkArea = ({
  socketRef,
  canvasRef,
  paths,
  setPaths,
  tracks,
  tabValue,
  setTabValue,
  chatDrawerOpen,
  setChatDrawerOpen,
  chatDrawerTab,
  setChatDrawerTab,
  sendMessage,
}) => {
  const theme = useTheme();

  const handleChatDrawerTabChange = (event, newValue) => {
    setChatDrawerTab(newValue);
  };

  return (
    <Paper>
      <Box sx={{ display: "flex" }}>
        <CodeAppBar />
        <LeftDrawer
          tracks={tracks}
          chatDrawerOpen={chatDrawerOpen}
          chatDrawerTab={chatDrawerTab}
          setTabValue={setTabValue}
          setChatDrawerTab={setChatDrawerTab}
          setChatDrawerOpen={setChatDrawerOpen}
        />
        <Main open={chatDrawerOpen} sx={{ flexGrow: 1 }}>
          <TabPanel value={tabValue} index={0}>
            <CodeComponent socketRef={socketRef} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Whiteboard
            paths={paths}
            setPaths={setPaths} 
            socketRef={socketRef}
            canvasRef={canvasRef} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Meet tracks={tracks} />
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
          <>
            <TabPanel value={chatDrawerTab} index={0}>
              <Chat sendMessage={sendMessage} />
            </TabPanel>
            <TabPanel value={chatDrawerTab} index={1}>
              <Users />
            </TabPanel>
          </>
        </Drawer>
      </Box>
    </Paper>
  );
};

export default RoomWorkArea;
