import axios from "../../api";
import { LOAD_CHAT_HISTORY } from "./types";
import { toast } from "react-toastify";

export const loadChatHostory = (roomId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `/chat/history/${roomId}`
    );
    dispatch({
        type: LOAD_CHAT_HISTORY,
        payload: data
      });
  } catch (error) {
    console.log("error", error);
    toast.error(error.message, {
      position: toast.POSITION.BOTTOM_LEFT,
    });
  }
};
