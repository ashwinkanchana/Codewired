import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Codemirror from "codemirror";
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
import "codemirror/addon/runmode/runmode";
import ACTIONS from "../../utils/actions";
import "./index.css";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const IDE = useSelector((state) => state.IDE);
  const dispatch = useDispatch();
  const editorRef = useRef(null);
  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: `clike`, json: true },
          theme: "dracula",
          showHint: true,
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          lineWrapping: true
        }
      );

      // editorRef.current.setValue(IDE.code);

      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes; // origin also provides informations like copy, cut, paste, etc
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []); // emitting code change

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]); // listening code change

  // useEffect(() => {
  //   editorRef.current.mode.name = getThemeForLanguage();
  // }, [IDE.language]);

  const getThemeForLanguage = () => {
    switch (IDE.language) {
      case "cpp":
      case "c":
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

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
