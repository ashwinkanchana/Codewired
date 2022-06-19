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
  const { roomId } = useSelector((state) => state.RTC);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeMode, setStrokeMode] = useState("draw");

  const [canvasProps, setCanvasProps] = useState({
    className: "react-sketch-canvas",
    width: "100%",
    height: "80vh",
    strokeWidth: 4,
    eraserWidth: 5,
    strokeColor: "#000000",
    canvasColor: "#FFFFFF",
    style: { border: "1px solid #CCC", borderRadius: "0.25rem" },
    allowOnlyPointerType: "all",
  });

  // const canvasRef = useRef();
  // const [paths, setPaths] = useState([]);
  const [lastStroke, setLastStroke] = useState({
    stroke: null,
    isEraser: null,
  });

  // const socketInitializer = useCallback(async () => {

  //   socketRef.current.on("update-canvas", (updatedPath) => {
  //     const newPath = [updatedPath, ...paths];
  //     canvasRef?.current?.loadPaths(newPath);
  //     setPaths(newPath);
  //   });

  //   socketRef.current.on("joined-drawing", ({ drawing, users }) => {
  //     canvasRef?.current?.loadPaths(drawing);
  //     setPaths(drawing);
  //   });

  //   socketRef.current.on("update-control", (updatedControl) => {
  //     switch (updatedControl) {
  //       case "undo":
  //         const undo = canvasRef.current?.undo;
  //         if (undo) {
  //           undo();
  //         }
  //         break;
  //       case "redo":
  //         const redo = canvasRef.current?.redo;
  //         if (redo) {
  //           redo();
  //         }
  //         break;
  //       case "clear":
  //         const clearCanvas = canvasRef.current?.clearCanvas;
  //         if (clearCanvas) {
  //           clearCanvas();
  //         }
  //         break;
  //       case "reset":
  //         const resetCanvas = canvasRef.current?.resetCanvas;
  //         if (resetCanvas) {
  //           resetCanvas();
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => socketInitializer(), [socketInitializer]);

  const handleStrokeColorChange = (color, event) => {
    setStrokeColor(color.hex);
  };

  const handleStrokeModeChange = (event, newMode) => {
    console.log(newMode);
    setStrokeMode(newMode);
  };

  const penHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(false);
    }
  };

  const eraserHandler = () => {
    const eraseMode = canvasRef.current?.eraseMode;

    if (eraseMode) {
      eraseMode(true);
    }
  };

  const undoHandler = () => {
    const undo = canvasRef.current?.undo;
    if (undo) {
      undo();
      socketRef.current?.emit("input-control", {
        type: "undo",
        drawingId: roomId,
      });
      if (paths.length === 1)
        socketRef.current.emit("update-canvas", {
          drawingId: roomId,
          msg: [],
        });
    }
  };

  const redoHandler = () => {
    const redo = canvasRef.current?.redo;

    if (redo) {
      socketRef.current?.emit("input-control", {
        type: "redo",
        drawingId: roomId,
      });
      redo();
    }
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
            ref={canvasRef}
            onChange={onChange}
            onStroke={(stroke, isEraser) => {
              console.log("onStroke", stroke.endTimestamp);
              // if (stroke.endTimestamp) {
              setLastStroke({ stroke, isEraser });
              socketRef.current.emit("input-canvas", {
                drawingId: roomId,
                msg: stroke,
              });
              // }
            }}
            {...canvasProps}
          />
        </Grid>
      </Grid>

      <Grid container>
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
            <Slider size="small" defaultValue={70} valueLabelDisplay="auto" />
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Undo">
              <IconButton>
                <Undo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton>
                <Redo />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear All">
              <IconButton>
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
