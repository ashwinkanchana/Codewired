import axios from "../../api";
import { GET_RTC_TOKEN, GET_RTC_TOKEN_LOADING } from "./types";
import { toast } from "react-toastify";

export const getToken = (roomId, uid) => async (dispatch) => {
  try {
    await dispatch({
      type: GET_RTC_TOKEN_LOADING,
    });
    const { data } = await axios.get(
      `/call/rtc/${roomId}/publisher/uid/${encodeURIComponent(uid)}`
    );
    await dispatch({
      type: GET_RTC_TOKEN,
      payload: { rtcToken: data.rtcToken, roomId, uid },
    });
  } catch (error) {
    console.log("error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
