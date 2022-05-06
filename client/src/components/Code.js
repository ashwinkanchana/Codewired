import React from 'react'
import Monaco from './Monaco';
import Split from 'react-split'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Fab } from '@mui/material';
import { PlayArrow, Cached } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_CODE, UPDATE_STDIN, UPDATE_LANGUAGE } from '../actions/types';
import { executeCode } from '../actions/codeActions';
import '../styles/io.css'

export default function Code(){
    const IDE_state = useSelector(state => state.IDE);
    const dispatch = useDispatch();

    const handleCodeChange = (event) => {
        dispatch({ type: UPDATE_CODE, payload: event.target.value })
    }

    const handleLanguageChange = (event) => {
        dispatch({ type: UPDATE_LANGUAGE, payload: event.target.value })
    }

    const handleStdInChange = (event) => {
        dispatch({ type: UPDATE_STDIN, payload: event.target.value })
    }


    const handleCodeExecutionRequest = (e) => {
        dispatch(executeCode(IDE_state.code, IDE_state.language, IDE_state.stdin))
    }

    const textAreaStyle = {
        color: 'white',
        // width: '100%',
        background: '#1e1e1e'
    }

    return (
        <>

            <Split
                className="split"
                sizes={[80, 20]}
            >
                <Monaco />



                <Stack>

                    <Typography variant="overline" display="block" gutterBottom>
                        Input
                    </Typography>
                    <TextareaAutosize
                        style={textAreaStyle}
                        minRows={13}
                        maxRows={15}
                        value={IDE_state.stdin}
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
                        value={IDE_state.run.stderr + (IDE_state.run.signal ? IDE_state.run.signal : '') + IDE_state.run.stdout}
                    />

                </Stack>
            </Split>




            <Fab
                disabled={IDE_state.is_executing}
                style={{
                    margin: 0,
                    top: 'auto',
                    right: 20,
                    bottom: 20,
                    left: 'auto',
                    position: 'fixed'
                }}
                onClick={() => {
                    handleCodeExecutionRequest()
                }}>
                {IDE_state.is_executing ?
                    <Cached />
                    :
                    <PlayArrow />
                }
            </Fab>
        </>
    )
}
