import { addUser, removeUser, getRoomUsers, getUser } from "./store.js";
const chat = (io) => {
  io.on("connect", (socket) => {
    socket.on("join", ({ user, room }, callback) => {
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
        socket.emit("message", {
          user: "admin",
          text: `Welcome ${response.user} `,
        });
        socket.broadcast.to(response.room).emit("message", {
          user: "admin",
          text: `${response.user} has joined`,
        });

        io.to(response.room).emit("roomMembers", getRoomUsers(response.room));
      }
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.room).emit("message", { user: user.user, text: message });

      callback();
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.room).emit("message", {
          user: "admin",
          text: `${user.user} has left`,
        });
      }
    });
  });
};

export default chat;
