import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_CODE } from "../../store/actions/types";
import ACTIONS from "../../utils/actions";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/mode/go/go";
import "codemirror/mode/swift/swift";
import "codemirror/mode/php/php";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/keymap/sublime";
import "codemirror/addon/runmode/runmode";

import "./index.css";

const Editor = ({ socketRef }) => {
  const IDE = useSelector((state) => state.IDE);
  const { roomId } = useSelector((state) => state.RTC);
  const dispatch = useDispatch();
 
  const getThemeForLanguage = () => {
    switch (IDE.language) {
      case "cpp":
        return "clike";
      case "c":
        return "clike";
      case "java":
        return "clike";
      case "go":
        return "go";
      case "swift":
        return "swift";
      case "php":
        return "php";
      default:
        return "javascript";
    }
  };

  return (
    <CodeMirror
      value={IDE.code}
      options={{
        mode: { name: getThemeForLanguage()},
        theme: "dracula",
        keyMap: "sublime",
        showHint: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        lineWrapping: true,
        indentWithTabs: true
      }}
      onBeforeChange={(editor, data, value) => {
        console.log("before", data.origin, value);
        if (["+input", "+delete", "cut", "paste", "undo", "redo"].includes(data.origin)) {
          dispatch({ type: UPDATE_CODE, payload: value });
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: value,
          });
        }
      }}
      onChange={(editor, data, value) => {
        //console.log("on", data.origin, value);
      }}
    />
  );
};

export default Editor;
