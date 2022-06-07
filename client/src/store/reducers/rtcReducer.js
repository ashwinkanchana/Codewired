import { GET_RTC_TOKEN, GET_RTC_TOKEN_LOADING } from "../actions/types";

const initState = {
  loading: false,
  rtcToken: "",
  uid: "",
  roomId: "",
};

const rtcReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_RTC_TOKEN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_RTC_TOKEN:
      return {
        ...state,
        loading: false,
        rtcToken: action.payload.rtcToken,
        uid: action.payload.uid,
        roomId: action.payload.roomId,
      };
    default:
      return state;
  }
};
export default rtcReducer;
