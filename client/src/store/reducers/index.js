import { combineReducers } from "redux";
import codeReducer from "./codeReducer";
import rtcReducer from "./rtcReducer";

export default combineReducers({
    IDE: codeReducer,
    RTC: rtcReducer
})