import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
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
import { ThemeProvider, createTheme } from "@mui/material/styles";
import RoomLayout from "../RoomLayout";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../store/actions/rtcActions";
import { Start, Shuffle } from "@mui/icons-material";
import { generateRandomName } from "randimal";
import { ToastContainer } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import "react-toastify/dist/ReactToastify.css";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const useClient = createClient({
  mode: "rtc",
  codec: "vp8",
});
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const Join = () => {
  const dispatch = useDispatch();
  const { rtcToken, loading } = useSelector((state) => state.RTC);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { roomId } = useParams();

  useEffect(() => {
    generateUsername();
    setUid(uuidv4());
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
      dispatch(getToken(roomId, username, uid));
    }
  };

  return (
    <>
      {!rtcToken.length ? (
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
                  id="name"
                  label="Name"
                  inputProps={{ maxLength: 28 }}
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
                loading={loading}
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
            <RoomLayout
              useClient={useClient}
              useMicrophoneAndCameraTracks={useMicrophoneAndCameraTracks}
            />
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default Join;
