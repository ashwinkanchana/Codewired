import React, { useState } from 'react'
import { SplitPane } from "react-collapse-pane";
import Monaco from './Monaco';
import TextareaAutosize from 'react-textarea-autosize';
import { Fab } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { connect } from 'react-redux'
import { executeCode } from '../actions'


const IDE = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');

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

    const executeCode = () => {
        //axios
    }

    const handleInputChange = (event)=>{
        setInput(event.target.value)
    }

    const onCodeExecute = () => {
        console.log(code)
        console.log(input)
    }


    return (
        <>

            <SplitPane split="horizontal"
            >
                <Monaco setCode={setCode} />
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
                            onChange={handleInputChange} />
                    </div>
                    <div style={ioDivStyle}>
                        {/* output text area */}
                        <TextareaAutosize
                            style={textAreaStyle}
                            readOnly
                            minRows={40}
                            maxRows={40} />
                    </div>
                </SplitPane>

            </SplitPane >
            <Fab
                style={{
                    margin: 0,
                    top: 'auto',
                    right: 20,
                    bottom: 20,
                    left: 'auto',
                    position: 'fixed',
                }}
                onClick={() => {
                    onCodeExecute()
                }}
                aria-label="edit">
                <PlayArrow />
            </Fab>
        </>
    )
}

export default IDE
