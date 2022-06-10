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

const Code = ({ socketRef}) => {
  const IDE = useSelector((state) => state.IDE);
  const dispatch = useDispatch();

  

  const handleLanguageChange = (event) => {
    dispatch({ type: UPDATE_LANGUAGE, payload: event.target.value });
  };

  const handleStdInChange = (event) => {
    const input = event.target.value;
    dispatch({ type: UPDATE_STDIN, payload: input });
  };

  const handleCodeExecutionRequest = (e) => {
    dispatch(executeCode(IDE.code, IDE.language, IDE.stdin));
  };

  const textAreaStyle = {
    color: "white",
    width: "100%",
    background: "#0000002e",
    border: "none",
    borderRadius: "4px",
    boxShadow: "none",
    outline: "none",
    padding: "10px",
  };

  return (
    <>
      <Paper sx={{ height: "100%", overflow: "hidden" }}>
        <Split className="split" sizes={[70, 30]}>
          <Box>
            <Editor
              socketRef={socketRef}
            />
          </Box>

          <Stack sx={{ p: 2 }} spacing={2}>
            <FormControl variant="standard">
              <InputLabel id="lang-select-label">Language</InputLabel>
              <Select
                variant="filled"
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

            <FormControl variant="standard">
              <Typography variant="overline" display="block" gutterBottom>
                Input
              </Typography>
              <TextareaAutosize
                data-gramm="false"
                style={textAreaStyle}
                minRows={13}
                maxRows={15}
                value={IDE.stdin}
                onChange={(e) => handleStdInChange(e)}
              />
            </FormControl>
            <FormControl variant="standard">
              <Typography variant="overline" display="block" gutterBottom>
                Output
              </Typography>
              <TextareaAutosize
                onClick={() => {
                  toast.info("Output is read only", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                  });
                }}
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
            </FormControl>
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
            zIndex: 12,
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
