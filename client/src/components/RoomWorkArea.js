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
import RoomDrawerLayout from "./DrawerLayout";


export default function RoomWorkArea({ tracks }) {
  const theme = useTheme();
  const { start, users } = useSelector((state) => state.RTC);
  const [tabValue, setTabValue] = useState(0);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatDrawerTab, setChatDrawerTab] = React.useState(1);

  

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
            <CodeComponent />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Whiteboard />
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
          <RoomDrawerLayout value={chatDrawerTab} />
        </Drawer>
      </Box>
     
      
    </Paper>
  );
}
