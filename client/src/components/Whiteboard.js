import React, { useState, useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import Grid from '@mui/material/Grid';
import { CirclePicker } from 'react-color';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import { getsocketIoInstance } from '../utils/socketio-client';


const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
};

export default function Whiteboard() {
    const canvasRef = useRef(null);
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [strokeMode, setStrokeMode] = useState('draw');

    const handleStrokeColorChange = (color, event) => {
        setStrokeColor(color.hex)
    }

    const handleStrokeModeChange = (event, newMode) => {
        console.log(newMode)
        setStrokeMode(newMode)

    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={9}>
                <ReactSketchCanvas
                    ref={canvasRef}
                    style={styles}
                    height="70vh"
                    strokeWidth={4}
                    strokeColor={strokeColor}
                />

            </Grid>
            <Grid item xs={3}>
                <Stack spacing={2} >
                    <ToggleButtonGroup
                        color="primary"
                        value={strokeMode}
                        exclusive
                        onChange={handleStrokeModeChange}
                        aria-label="Mode"
                    >
                        <ToggleButton value="draw">
                            <EditIcon />
                            Draw
                        </ToggleButton>
                        <ToggleButton value="erase">
                            <AutoFixNormalIcon />
                            Erase
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <CirclePicker
                        colors={["#f44336", "#ff9800", "#9c27b0", "#3f51b5", "#009688", "#000000"]}
                        onChange={handleStrokeColorChange} />
                </Stack>
            </Grid>
        </Grid>




    )
}