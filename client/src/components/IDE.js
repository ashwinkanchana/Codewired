import React, { useState } from 'react'
import { SplitPane } from "react-collapse-pane";
import Monaco from './Monaco';
import TextareaAutosize from 'react-textarea-autosize';
import { Fab } from '@mui/material';
import { PlayArrow, Cached } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_CODE, UPDATE_STDIN, UPDATE_LANGUAGE } from '../actions/types';
import { executeCode } from '../actions/codeActions';


const IDE = () => {
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
        width: '100%',
        background: '#1e1e1e'
    }
    const ioDivStyle = {
        width: '100%',
        height: '100%',
        background: '#1e1e1e'
    }


    return (
        <>
            <div>
                <select name="lang" id="lang"
                    value={IDE.language}
                    onChange={(e) => handleLanguageChange(e)}>
                    <option value="c++">cpp</option>
                    <option value="java">java</option>
                    <option value="python">python</option>
                    <option value="javascript">javascript</option>
                    <option value="go">go</option>
                </select>
            </div >
            <SplitPane split="horizontal"
            >
                <Monaco />
                <SplitPane
                    split="vertical"
                    initialSizes={[1, 1]}
                    hooks={{ onSaveSizes: sizes => console.log(sizes) }}
                    collapseOptions={{
                        collapseTransitionTimeout: 20,
                    }}
                >

                    <div style={ioDivStyle}>
                        {/* input text area */}
                        <TextareaAutosize
                            style={textAreaStyle}
                            minRows={40}
                            maxRows={40}
                            value={IDE.stdin}
                            onChange={(e) => handleStdInChange(e)} />
                    </div>
                    <div style={(IDE_state.run.code === 0) ? ioDivStyle : {}}>
                        {(IDE_state.run.code !== 0) ?
                            <TextareaAutosize
                                style={textAreaStyle}
                                readOnly
                                minRows={40}
                                maxRows={40}
                                value={IDE_state.run.stderr + (IDE_state.run.signal ? IDE_state.run.signal : '')}
                            />
                            :
                            <TextareaAutosize
                                style={textAreaStyle}
                                readOnly
                                minRows={40}
                                maxRows={40}
                                value={IDE_state.run.stdout}
                            />
                        }
                    </div>
                </SplitPane>

            </SplitPane >
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

export default IDE
