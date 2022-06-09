import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Toolbar,
  Stack,
  List,
  Grid,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Badge,
  AppBar,
  Switch,
  Fab,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  CallEnd,
  Videocam,
  Mic,
} from "@mui/icons-material";

const MediaControls = ({
  client,
  tracks,
  setStart,
  trackState,
  setTrackState
}) => {

  const navigate = useNavigate();
  



  

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);

    navigate("/");
  };

  return (
    <>
     
        <AppBar
          position="fixed"
          sx={{
            top: "auto",
            bottom: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar variant="dense" sx={{ justifyContent: "center" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Stack
                direction="row"
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
              <Tooltip title="Leave call">
                <Fab onClick={() => leaveChannel()} size="small" color="error">
                  <CallEnd fontSize="small" />
                </Fab>
              </Tooltip>
              <Stack
                direction="row"
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

              
             
            </Stack>
          </Toolbar>
        </AppBar>
    
    </>
  );
};

export default MediaControls;
