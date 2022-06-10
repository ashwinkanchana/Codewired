import { combineReducers } from "redux";
import codeReducer from "./codeReducer";
import rtcReducer from "./rtcReducer";
import chatReducer from "./chatReducers";

export default combineReducers({
  IDE: codeReducer,
  RTC: rtcReducer,
  CHAT: chatReducer,
});
