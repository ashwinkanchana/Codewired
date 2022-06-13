import axios from "../../api";
import { CHAT_HISTORY_LOADING, FETCH_CHAT_HISTORY, GET_RTC_TOKEN, GET_RTC_TOKEN_LOADING, UPDATE_CODE, UPDATE_LANGUAGE, UPDATE_STDIN } from "./types";
import { toast } from "react-toastify";

export const getToken = (roomId, username, uid) => async (dispatch) => {
  try {
    dispatch({
      type: GET_RTC_TOKEN_LOADING,
    });
    const { data } = await axios.get(
      `/call/rtc/${roomId}/publisher/uid/${encodeURIComponent(uid)}`
    );
    console.log('data', data)
    dispatch({
      type: GET_RTC_TOKEN,
      payload: { rtcToken: data.rtcToken, roomId, uid, username},
    });
    dispatch({ type: UPDATE_CODE, payload: data.roomData.code });
    dispatch({ type: UPDATE_STDIN, payload: data.roomData.stdin });
    dispatch({ type: UPDATE_LANGUAGE, payload: data.roomData.language });
    dispatch({ type: FETCH_CHAT_HISTORY, payload: data.roomData.chat });
  } catch (error) {
    console.log("error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
