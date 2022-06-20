import React, { useState, useRef, useEffect, useCallback } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { CirclePicker } from "react-color";
import {
  Paper,
  Stack,
  Slider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AutoFixNormal,
  Edit,
  Redo,
  Undo,
  ClearAll,
  Brush,
} from "@mui/icons-material";

import "./style.css";
import { useSelector } from "react-redux";

export default function Whiteboard({ socketRef, canvasRef, paths, setPaths }) {
  const { uid, roomId } = useSelector((state) => state.RTC);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeSize, setStrokeSize] = useState(4);
  const [strokeMode, setStrokeMode] = useState("draw");

  const [canvasProps, setCanvasProps] = useState({
    className: "react-sketch-canvas",
    width: "100%",
    height: "75vh",
    canvasColor: "#FFFFFF",
    style: { border: "1px solid #CCC", borderRadius: "0.25rem" },
    allowOnlyPointerType: "all",
  });

  //const canvasRef = useRef(null);
  // const [paths, setPaths] = useState([]);
  const [lastStroke, setLastStroke] = useState({
    stroke: null,
    isEraser: null,
  });

  useEffect(()=>{
    socketRef.current.emit("join-drawing", {
      name: uid,
      drawingId: roomId,
      color: "#000000",
    });
  },[])

  useEffect(() => {
    const eraseMode = canvasRef.current?.eraseMode;
    if (strokeMode === "draw") eraseMode(false);
    else eraseMode(true);
  }, [strokeMode, canvasRef]);

  const handleStrokeColorChange = (color, event) => {
    setStrokeColor(color.hex);
  };

  const handleStrokeModeChange = (event, newMode) => {
    setStrokeMode(newMode);
  };

  const clearHandler = () => {
    const clearCanvas = canvasRef.current?.clearCanvas;

    if (clearCanvas) {
      socketRef.current?.emit("input-control", {
        type: "clear",
        drawingId: roomId,
      });
      socketRef.current?.emit("update-canvas", {
        drawingId: roomId,
        msg: [],
      });
      clearCanvas();
    }
  };

  const onChange = (updatedPaths) => {
    if (updatedPaths.length) {
      socketRef.current?.emit("update-canvas", {
        drawingId: roomId,
        msg: updatedPaths,
      });
    }
    setPaths(updatedPaths);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <ReactSketchCanvas
            defaultValue={paths}
            ref={canvasRef}
            onChange={onChange}
            onStroke={(stroke, isEraser) => {
              setLastStroke({ stroke, isEraser });
              socketRef.current.emit("input-canvas", {
                drawingId: roomId,
                msg: stroke,
              });
            }}
            strokeColor={strokeColor}
            strokeWidth={strokeSize}
            eraserWidth={strokeSize}
            {...canvasProps}
          />
        </Grid>
      </Grid>

      <Grid container p={2}>
        <Grid item xs={2}>
          <ToggleButtonGroup
            color="primary"
            value={strokeMode}
            exclusive
            onChange={handleStrokeModeChange}
            aria-label="Mode"
          >
            <ToggleButton value="draw">
              <Edit />
              Draw
            </ToggleButton>
            <ToggleButton value="erase">
              <AutoFixNormal />
              Erase
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={3}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Stroke size">
              <IconButton>
                <Brush />
              </IconButton>
            </Tooltip>
            <Slider
              size="small"
              defaultValue={strokeSize}
              onChange={(e) => setStrokeSize(e.target.value)}
              min={1}
              max={100}
              valueLabelDisplay="auto"
            />
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Clear All">
              <IconButton onClick={() => clearHandler()}>
                <ClearAll />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid item xs={3}>
          <CirclePicker
            colors={[
              "#f44336",
              "#ff9800",
              "#9c27b0",
              "#3f51b5",
              "#009688",
              "#000000",
            ]}
            onChange={handleStrokeColorChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
