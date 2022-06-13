import mongoose from "mongoose";
import Chat from "./Chat.js";
const RoomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    language: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'c++'
    },
    stdin: {
      type: String,
      trim: true,
      default: 'Hello'
    },
    chat: {
      type: [Chat.schema],
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);

export default Room;
