import axios from "../../api";
import { toast } from "react-toastify";
import {
  REQUEST_EXECUTION,
  UPDATE_RUN,
  FETCH_CODE_HISTORY,
  CODE_HISTORY_LOADING,
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

export const fetchCodeHistory = (roomId) => async (dispatch) => {
  console.log("fetchCodeHistory");
  dispatch({
    type: CODE_HISTORY_LOADING,
  });
  try {
    const { data } = await axios.get(`/code/history/${roomId}`);
    console.log("fetchCodeHistory", data);
    await dispatch({
      type: FETCH_CODE_HISTORY,
      payload: {
        language: data.language,
        code: data.code,
      },
    });
  } catch (error) {
    console.log("fetchCodeHistory error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
