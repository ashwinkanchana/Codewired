import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import RoomLayout from "../RoomLayout";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../store/actions/rtcActions";
import { Start, Shuffle } from "@mui/icons-material";
import { generateRandomName } from "randimal";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useClient = createClient({
  mode: "rtc",
  codec: "vp8",
});

const Join = () => {
  const dispatch = useDispatch();
  const RTC = useSelector((state) => state.RTC);
  const [username, setUsername] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rtcToken, setRtcToken] = useState("");
  const [uid, setUID] = useState("");
  const [joined, setJoined] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    generateUsername();
    setUID(uuidv4());
  }, []);

  useEffect(() => {
    if (formSubmit) {
      if (username.length === 0) {
        setError(true);
        setErrorMessage("Name is required");
      } else {
        setError(false);
        setErrorMessage("");
      }
    }
  }, [formSubmit, username]);

  const generateUsername = async () => {
    const name = await generateRandomName();
    setUsername(name);
  };

  const handleNameInput = (e) => {
    setUsername(e.target.value);
  };

  const handleJoin = () => {
    setFormSubmit(true);
    if (!error && username.length) {
      dispatch(getToken(roomId, username));
    }
  };

  return (
    <>
      {!RTC?.rtcToken ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              minWidth: "40%",
              p: 3,
            }}
          >
            <Stack spacing={2} justifyItems="center">
              <Typography variant="overline" component="h2">
                What's your name?
              </Typography>

              <FormControl variant="outlined">
                <InputLabel htmlFor="name-join-room">Name</InputLabel>
                <OutlinedInput
                  value={username}
                  onChange={handleNameInput}
                  error={error}
                  helperText={errorMessage}
                  id="name"
                  label="Name"
                  endAdornment={
                    <InputAdornment position="end">
                      <Tooltip title="Generate Username">
                        <IconButton
                          aria-label="generate name"
                          onClick={generateUsername}
                          edge="end"
                        >
                          <Shuffle />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
                <FormHelperText error={error} id="name-error">
                  {errorMessage}
                </FormHelperText>
              </FormControl>

              <LoadingButton
                onClick={handleJoin}
                endIcon={<Start />}
                loading={RTC.loading}
                loadingPosition="end"
                variant="contained"
              >
                Join
              </LoadingButton>
            </Stack>
          </Box>
          <ToastContainer />
        </>
      ) : (
        <>
          <ThemeProvider theme={darkTheme}>
            <RoomLayout />
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default Join;
