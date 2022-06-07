import React, { useEffect, useState, useRef } from "react";
import ACTIONS from "../../utils/actions";
import Editor from "../Editor";
import { initSocket } from "../../utils/socketio-client";
import Split from "react-split";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Fab, Paper, Grid } from "@mui/material";
import { PlayArrow, Cached } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import Monaco from "../Monaco";
import { toast, ToastContainer } from "react-toastify";
import {
  UPDATE_CODE,
  UPDATE_STDIN,
  UPDATE_LANGUAGE,
} from "../../store/actions/types";
import { executeCode } from "../../store/actions/codeActions";

import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

import "./style.css";

const Code = () => {
  const IDE = useSelector((state) => state.IDE);
  const RTC = useSelector((state) => state.RTC);
  const dispatch = useDispatch();

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    codeRef.current = IDE.code;
    const init = async () => {
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        navigate("/");
      }

      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      // message send to server, event emit
      socketRef.current.emit(ACTIONS.JOIN, {
        // join event
        roomId, // useParams - link param
        username: RTC.uid,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          // Listening for joined event
          if (username !== RTC.uid) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            // emit code change (sync)
            code: codeRef.current,
            //code: IDE.code,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        // Listening for disconnected
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          // filtering clients other than left one
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      // clear listeners
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const handleCodeChange = (code) => {
    dispatch({ type: UPDATE_CODE, payload: code });
  };

  const handleLanguageChange = (event) => {
    dispatch({ type: UPDATE_LANGUAGE, payload: event.target.value });
  };

  const handleStdInChange = (event) => {
    const input = event.target.value
    dispatch({ type: UPDATE_STDIN, payload: input });
  };

  const handleCodeExecutionRequest = (e) => {
    dispatch(executeCode(IDE.code, IDE.language, IDE.stdin));
  };

  const textAreaStyle = {
    color: "white",
    width: "100%",
    background: "#1e1e1e",
  };

  return (
    <>
      <Paper sx={{ height: "94vh" }}>
        <Split className="split" sizes={[80, 20]}>
          <Box>
            <Editor
              socketRef={socketRef}
              roomId={roomId}
              onCodeChange={(code) => {
                codeRef.current = code;
                dispatch({ type: UPDATE_CODE, payload: code });
              }}
            />
          </Box>

          <Stack>
            <FormControl variant="standard">
              <InputLabel id="lang-select-label">Language</InputLabel>
              <Select
                labelId="lang-select-label"
                id="lang-select"
                value={IDE.language}
                label="Language"
                onChange={handleLanguageChange}
              >
                <MenuItem value={"c++"}>C++</MenuItem>
                <MenuItem value={"java"}>Java</MenuItem>
                <MenuItem value={"python"}>Python</MenuItem>
                <MenuItem value={"javascript"}>JavaScript</MenuItem>
                <MenuItem value={"go"}>Go</MenuItem>
                <MenuItem value={"c"}>C</MenuItem>
                <MenuItem value={"php"}>PHP</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="overline" display="block" gutterBottom>
              Input
            </Typography>
            <TextareaAutosize
              style={textAreaStyle}
              minRows={13}
              maxRows={15}
              value={IDE.stdin}
              onChange={(e) => handleStdInChange(e)}
            />
            <Typography variant="overline" display="block" gutterBottom>
              Output
            </Typography>
            <TextareaAutosize
              style={textAreaStyle}
              readOnly
              minRows={13}
              maxRows={15}
              value={
                IDE.run.stderr +
                (IDE.run.signal ? IDE.run.signal : "") +
                IDE.run.stdout
              }
            />
          </Stack>
        </Split>

        <Fab
          disabled={IDE.is_executing}
          style={{
            margin: 0,
            top: "auto",
            right: 20,
            bottom: 20,
            left: "auto",
            position: "fixed",
          }}
          onClick={() => {
            handleCodeExecutionRequest();
          }}
        >
          {IDE.is_executing ? <Cached /> : <PlayArrow />}
        </Fab>
      </Paper>
    </>
  );
};

export default Code;
