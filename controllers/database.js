import Room from "../models/Room.js";
import Chat from "../models/Chat.js";

//update code by roomId
const updateCode = async (roomId, code) => {
  try {
    const query = { roomId };
    const update = { code };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const { data } = await Room.findOneAndUpdate(query, update, options);
    return data;
  } catch (error) {
    console.log("updateCode error", error);
    return false;
  }
};

//update language by roomID
const updateRoomLanguage = async (roomId, language) => {
  try {
    const query = { roomId };
    const update = { language };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const { data } = await Room.findOneAndUpdate(query, update, options);
    return data;
  } catch (error) {
    console.log("updateRoomLanguage error", error);
    return false;
  }
};

//add new chat
const addNewChatMessage = async (roomId, text, user) => {
  try {
    let room = await Room.findOne({ roomId });
    room.chat.push({ text, user });
    const res = await room.save();
    console.log("addNewChatMessage res", res);
    return true;
  } catch (error) {
    console.log("addNewChatMessage error", error);
    return false;
  }
};

//get chat history by roomId, order by time
const getChatHistory = async (roomId) => {
  try {
    let room = await Room.findOne({ roomId });
    console.log("getChatHistory res", room.chat);
    return room.chat;
  } catch (error) {
    console.log("getChatHistory error", error);
    return false;
  }
};

const getRoomOrCreate = async (roomId) => {
  try {
    let data = null;
    data = await Room.findOne({ roomId });
    if (!data) {
      const newRoom = new Room({
        roomId,
      });
      data = await newRoom.save();
    }
    return data;
  } catch (error) {
    console.log("getRoomState error", error);
    return null;
  }
};

export {
  updateCode,
  updateRoomLanguage,
  addNewChatMessage,
  getChatHistory,
  getRoomOrCreate,
};
