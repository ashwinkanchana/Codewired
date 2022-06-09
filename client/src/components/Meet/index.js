import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Box, Stack, Grid, Typography, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { CenterLoadingSpinner } from "../RoomComponents";
import { AgoraVideoPlayer } from "agora-rtc-react";
import NewWindow from 'react-new-window'
import "./index.css";

const Meet = ({tracks}) => {
  const [opened, setOpened] = useState(false);
  const { start, users } = useSelector((state) => state.RTC);
  return (
    <>
    
      {start ? (
        <Box sx={{ display: "flex" }}>
          <>
            <div id="videos">
              <AgoraVideoPlayer
                style={{ height: "95%", width: "95%" }}
                className="vid"
                videoTrack={tracks[1]}
              />
              {users.length > 0 &&
                users.map((user) => {
                  if (user.videoTrack) {
                    return (
                      <AgoraVideoPlayer
                        style={{ height: "95%", width: "95%" }}
                        className="vid"
                        videoTrack={user.videoTrack}
                        key={user.uid}
                      />
                    );
                  } else return null;
                })}
            </div>
          </>
        </Box>
      ) : (
        <CenterLoadingSpinner />
      )}
      {/*
      <Button
        onClick={() => {
          setOpened((prev) => {
            return !prev;
          });
        }}
      >
        {opened ? "Close" : "Open "}
      </Button>
      
      {opened && (
        <NewWindow
          onUnload={() => this.newWindowUnloaded()}
          features={{ left: 200, top: 200, width: 400, height: 400 }}
        >
          {start ? (
        <Box sx={{ display: "flex" }}>
          <>
            <div id="videos">
              <AgoraVideoPlayer
                style={{ height: "95%", width: "95%" }}
                className="vid"
                videoTrack={tracks[1]}
              />
              {users.length > 0 &&
                users.map((user) => {
                  if (user.videoTrack) {
                    return (
                      <AgoraVideoPlayer
                        style={{ height: "95%", width: "95%" }}
                        className="vid"
                        videoTrack={user.videoTrack}
                        key={user.uid}
                      />
                    );
                  } else return null;
                })}
            </div>
          </>
        </Box>
      ) : (
        <CenterLoadingSpinner />
      )}
        </NewWindow>
      )} */}
    </>
  );
};

export default Meet;
