import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      trim: true
    }
  }, { timestamps: true });
  
  const Chat = mongoose.model("Chat", ChatSchema);
  
  export default Chat;