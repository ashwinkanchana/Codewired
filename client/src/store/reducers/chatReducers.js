import _ from "lodash";
import {
  CHAT_HISTORY_LOADING,
  FETCH_CHAT_HISTORY,
  ADD_NEW_MESSAGE,
  COMPOSE_MESSAGE,
  UPDATE_ROOM_USERS,
} from "../actions/types";

const initState = {
  chat_history_loading: false,
  messages: [],
  message: "",
  users: [],
};

const chatReducer = (state = initState, action) => {
  switch (action.type) {
    case CHAT_HISTORY_LOADING:
      return {
        ...state,
        chat_history_loading: true,
      };
    case FETCH_CHAT_HISTORY:
      return {
        ...state,
        chat_history_loading: false,
        messages: action.payload,
      };
    case ADD_NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case UPDATE_ROOM_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case COMPOSE_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};
export default chatReducer;
