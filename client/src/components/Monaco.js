import React, { useRef } from 'react'
import Editor from "@monaco-editor/react";
import { useSelector, useDispatch } from 'react-redux';
import { UPDATE_CODE } from '../actions/types';
import { io } from 'socket.io-client'

export default function Monaco() {
    const IDE = useSelector(state => state.IDE);
    const dispatch = useDispatch();
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;


        const socket = io('ws://localhost:4001', {
            transports: ['websocket']
        })


        var issocket = false
        var isadmin = false
        var users = {}
        var contentWidgets = {}
        var decorations = {}

        function insertCSS(id, color) {
            var style = document.createElement('style')
            style.type = 'text/css'
            style.innerHTML += '.' + id + ' { background-color:' + color + '}\n'
            style.innerHTML += `
    .${id}one { 
        background: ${color};
        width:2px !important 
    }`
            document.getElementsByTagName('head')[0].appendChild(style)
        }
        /**
         * add Widget to new user (display name) - 새로운 사용자를 위한 위젯을 추가한다 (이름을 출력하는 곳) 
         * @param {User} e user
         */
        function insertWidget(e) {
            contentWidgets[e.user] = {
                domNode: null,
                position: {
                    lineNumber: 0,
                    column: 0
                },
                getId: function () {
                    return 'content.' + e.user
                },
                getDomNode: function () {
                    if (!this.domNode) {
                        this.domNode = document.createElement('div')
                        this.domNode.innerHTML = e.user
                        this.domNode.style.background = e.color
                        this.domNode.style.color = 'black'
                        this.domNode.style.opacity = 0.6
                        this.domNode.style.width = 'max-content'
                    }
                    return this.domNode
                },
                getPosition: function () {
                    return {
                        position: this.position,
                        preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
                    }
                }
            }
        }
        /**
         * change Widget Position - 위젯의 x, y를 통해 위치를 바꾼다.
         * @param {User} e user
         */
        function changeWidgetPosition(e) {
            contentWidgets[e.user].position.lineNumber = e.selection.endLineNumber
            contentWidgets[e.user].position.column = e.selection.endColumn

            editor.removeContentWidget(contentWidgets[e.user])
            editor.addContentWidget(contentWidgets[e.user])
        }
        /**
         * change Selection Cursor - 선택된 곳을 바꾼다.
         * @param {monaco.editor.ICursorSelectionChangedEvent} e Cursor Selection Event, (Add User) - 커서 선택 이벤트 (User객체의 데이터도 추가됨)
         */
        function changeSeleciton(e) {
            var selectionArray = []
            if (e.selection.startColumn == e.selection.endColumn && e.selection.startLineNumber == e.selection.endLineNumber) {
                e.selection.endColumn++
                selectionArray.push({
                    range: e.selection,
                    options: {
                        className: `${e.user}one`,
                        hoverMessage: {
                            value: e.user
                        }
                    }
                })

            } else {
                selectionArray.push({
                    range: e.selection,
                    options: {
                        className: e.user,
                        hoverMessage: {
                            value: e.user
                        }
                    }
                })
            }
            for (let data of e.secondarySelections) {
                if (data.startColumn == data.endColumn && data.startLineNumber == data.endLineNumber) {
                    selectionArray.push({
                        range: data,
                        options: {
                            className: `${e.user}one`,
                            hoverMessage: {
                                value: e.user
                            }
                        }
                    })
                } else
                    selectionArray.push({
                        range: data,
                        options: {
                            className: e.user,
                            hoverMessage: {
                                value: e.user
                            }
                        }
                    })
            }
            decorations[e.user] = editor.deltaDecorations(decorations[e.user], selectionArray)
        }
        /**
         * 
         * @param {monaco.editor.IModelContentChangedEvent} e monaco ContentChange Event
         */
        function changeText(e) {
            editor.getModel().applyEdits(e.changes)
        }


        editor.onDidChangeModelContent(function (e) { //Text Change
            if (issocket == false) {
                socket.emit('key', e)
            } else
                issocket = false
        })
        editor.onDidChangeCursorSelection(function (e) {    //Cursor or Selection Change
            socket.emit('selection', e)
        })



        socket.on('connected', function (data) { //Connect New Client Event
            users[data.user] = data.color
            insertCSS(data.user, data.color)
            insertWidget(data)
            decorations[data.user] = []
            if (isadmin === true) {
                editor.updateOptions({ readOnly: false })
                socket.emit("filedata", editor.getValue())
            }
        })
        socket.on('userdata', function (data) {     //Connected Client Status Event
            if (data.length == 1)
                isadmin = true
            for (var i of data) {
                users[i.user] = i.color
                insertCSS(i.user, i.color)
                insertWidget(i)
                decorations[i.user] = []
            }
        })
        socket.on('resetdata', function (data) {    //get Default Editor Value
            issocket = true
            editor.setValue(data)
            editor.updateOptions({ readOnly: false })
            issocket = false
        })
        socket.on('admin', function (data) {    //admin Event  
            isadmin = true
            editor.updateOptions({ readOnly: false })
        })
        socket.on('selection', function (data) {    //change Selection Event
            changeSeleciton(data)
            changeWidgetPosition(data)
        })
        socket.on('exit', function (data) { //Other User Exit Event
            editor.removeContentWidget(contentWidgets[data])
            editor.deltaDecorations(decorations[data], [])
            delete decorations[data]
            delete contentWidgets[data]
        })

        socket.on('key', function (data) {  //Change Content Event
            issocket = true
            changeText(data)
        })

    }

   
    const handleCodeChange = (value, event) => {
        dispatch({ type: UPDATE_CODE, payload: value })
    }


    return (
        <Editor
            height="90%"
            theme="vs-dark"
            defaultLanguage={IDE.language}
            defaultValue={IDE.code}
            onMount={handleEditorDidMount}
            onChange={handleCodeChange}
        />
    )
}
