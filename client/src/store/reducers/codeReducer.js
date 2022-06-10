import _ from "lodash";
import {
  UPDATE_LANGUAGE,
  UPDATE_CODE,
  UPDATE_STDIN,
  UPDATE_RUN,
  REQUEST_EXECUTION,
  CODE_REMOVE_CLIENT,
  CODE_SET_CLIENTS,
  CODE_HISTORY_LOADING,
  FETCH_CODE_HISTORY
} from "../actions/types";

const initState = {
  languages_loading: false,
  languages: [],
  language: "python",
  code: ``,
  stdin: "test",
  is_executing: false,
  clients: [],
  run: {
    stdout: "",
    stderr: "",
    code: 0,
    signal: null,
    output: "",
  },
};

const codeReducer = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_CODE:
      return {
        ...state,
        code: action.payload,
      };
    case UPDATE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case UPDATE_STDIN:
      return {
        ...state,
        stdin: action.payload,
      };
    case UPDATE_RUN:
      return {
        ...state,
        is_executing: false,
        run: action.payload,
      };
    case REQUEST_EXECUTION:
      return {
        ...state,
        is_executing: true,
      };
    case CODE_SET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
      };
    case CODE_REMOVE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(
          (client) => client.socketId !== action.payload
        ),
      };
      case CODE_HISTORY_LOADING:
        return {
          ...state,
          history_loading: true,
        };
      case FETCH_CODE_HISTORY:
        return {
          ...state,
          history_loading: false,
          code: action.payload.code,
          language: action.payload.language,
        };
    default:
      return state;
  }
};
export default codeReducer;
