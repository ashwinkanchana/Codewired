import { addUser, removeUser, getRoomUsers, getUser } from "./store.js";
import { addNewChatMessage } from "../controllers/database.js";

import actions from "./actions.js";
import ACTIONS from "../client/src/utils/actions.js";
const chat = (io) => {
  io.on("connect", (socket) => {
    socket.on(ACTIONS.JOIN, ({ user, room }, callback) => {
      if (user && room) {
        const { response, error } = addUser({
          id: socket.id,
          user: user,
          room: room,
        });

        if (error) {
          callback(error);
          return;
        }
        socket.join(response.room);

        socket.emit(actions.RECEIVE_MESSAGE, {
          user: "Admin",
          text: `Welcome ${response.user} `,
        });
        let text2 = `${response.user} has joined`;
        if (user) addNewChatMessage(user.room, text2, "Admin");
        socket.broadcast.to(response.room).emit(actions.RECEIVE_MESSAGE, {
          user: "Admin",
          text: text2,
        });

        io.to(response.room).emit(
          actions.ROOM_MEMBERS,
          getRoomUsers(response.room)
        );
      }
    });

    socket.on(actions.SEND_MESSAGE, (message, callback) => {
      const user = getUser(socket.id);
      addNewChatMessage(user.room, message, user.user);
      io.to(user.room).emit(actions.RECEIVE_MESSAGE, {
        user: user.user,
        text: message,
      });

      callback();
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      const socketUser = removeUser(socket.id);

      if (socketUser) {
        const user = "Admin";
        const text = `${socketUser.user} has left`;
        io.to(socketUser.room).emit(actions.RECEIVE_MESSAGE, {
          user,
          text,
        });
        addNewChatMessage(socketUser.room, text, user);
      }
    });
  });
};

export default chat;
