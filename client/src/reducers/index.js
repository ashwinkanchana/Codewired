import { combineReducers } from "redux";
import codeReducer from "./codeReducer";

export default combineReducers({
    code: codeReducer
})
