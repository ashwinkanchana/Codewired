import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Stack, Grid, Typography, CircularProgress } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import VideoGrid from "../MeetVideoGrid";
import MediaControls from "../MeetControlBar";

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

const Meet = ({
  tracks,
  client,
  users,
  start,
  setStart,
  trackState,
  setTrackState
}) => {
  return (
    <>
      {!(start && tracks) ? (
        <CenterLoadingSpinner />
      ) : (
        <>
          <Box sx={{ display: "flex" }}>
            <MediaControls
              client={client}
              tracks={tracks}
              setStart={setStart}
              trackState={trackState}
              setTrackState={setTrackState}
            />
            <VideoGrid users={users} tracks={tracks} />
          </Box>
        </>
      )}
    </>
  );
};

export default Meet;
