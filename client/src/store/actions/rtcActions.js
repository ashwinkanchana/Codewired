import axios from "../../api";
import { GET_RTC_TOKEN, GET_RTC_TOKEN_LOADING } from "./types";
import { toast } from "react-toastify";

export const getToken = (roomId, username, uid) => async (dispatch) => {
  try {
    dispatch({
      type: GET_RTC_TOKEN_LOADING,
    });
    const { data } = await axios.get(
      `/call/rtc/${roomId}/publisher/uid/${encodeURIComponent(uid)}`
    );
    dispatch({
      type: GET_RTC_TOKEN,
      payload: { rtcToken: data.rtcToken, roomId, uid, username},
    });
  } catch (error) {
    console.log("error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
