import {
  GET_RTC_TOKEN,
  GET_RTC_TOKEN_LOADING,
  START_RTC,
  ADD_USER,
  REMOVE_USER,
  TOGGLE_CAMERA,
  TOGGLE_MIC,
} from "../actions/types";

const initState = {
  loading: false,
  rtcToken: "",
  uid: "",
  username: "",
  roomId: "",
  start: false,
  appId: process.env.REACT_APP_AGORA_ID,
  users: [],
  trackState: { video: false, audio: false },
};

const rtcReducer = (state = initState, action) => {
  switch (action.type) {
    case GET_RTC_TOKEN_LOADING:
      return {
        ...state,
        loading: true,
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.uid !== action.payload),
      };
    case START_RTC:
      return {
        ...state,
        start: true,
      };
    case TOGGLE_CAMERA:
      return {
        ...state,
        trackState: { ...state.trackState, video: !state.trackState.video },
      };
    case TOGGLE_MIC:
      return {
        ...state,
        trackState: { ...state.trackState, audio: !state.trackState.audio },
      };

    case GET_RTC_TOKEN:
      return {
        ...state,
        loading: false,
        rtcToken: action.payload.rtcToken,
        uid: action.payload.uid,
        roomId: action.payload.roomId,
        username: action.payload.username,
      };

    default:
      return state;
  }
};
export default rtcReducer;
