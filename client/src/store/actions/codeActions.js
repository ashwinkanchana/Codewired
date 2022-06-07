import axios from "../../api";
import { toast } from "react-toastify";
import {
  REQUEST_EXECUTION,
  UPDATE_RUN,
  GET_LANGUAGES_LIST,
  LANGUAGES_LIST_LOADING,
} from "./types";

export const executeCode = (code, language, stdin) => async (dispatch) => {
  console.log("executeCode");
  dispatch({
    type: REQUEST_EXECUTION,
  });
  var res = { data: [] };
  try {
    res = await axios.post("/code/execute", {
      code,
      language,
      stdin,
    });
    await dispatch({
      type: UPDATE_RUN,
      payload: res.data,
    });
  } catch (error) {
    console.log("executeCode error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};

export const loadLanguages = () => async (dispatch) => {
  console.log("loadLanguages");
  dispatch({
    type: LANGUAGES_LIST_LOADING,
  });
  try {
    const { data } = await axios.get("/code/runtimes");
    console.log("loadLanguages", data);
    await dispatch({
      type: GET_LANGUAGES_LIST,
      payload: data,
    });
  } catch (error) {
    console.log("loadLanguages error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
